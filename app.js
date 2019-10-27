const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const pino = require("express-pino-logger")();
const getGithubUserOrgs = require("./library/githubUser/getGithubUserOrgs");
const getGithubUser = require("./library/githubUser/getGithubUser");
const managementApiToken = require("./library/auth0/getManagementApiToken");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();

// Create a new Express app
const app = express();

// Set up Auth0 configuration
const authConfig = {
  domain: "devopslibrary.auth0.com",
  audience: "kondo-backend"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from devopslibrary.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

// Use session https://github.com/expressjs/session
var sess = {
  store: new RedisStore({ client: redisClient }),
  secret: "I like Santa",
  cookie: {},
  resave: false,
  saveUninitialized: false
};
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));
// End session code

// Add Logger (Pino)
app.use(pino);

// Get management token from Auth0
let authToken;
app.use(express.json());
app.listen(3001, async function() {
  console.log("App is ready");
  await managementApiToken.token.then(function(token) {
    authToken = token;
  });
});

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  const userId = req.user.sub.split("|")[1];
  getGithubUser(authToken, userId).then(function(user) {
    const githubToken = user.identities[0].access_token;
    getGithubUserOrgs(githubToken).then(function(orgs) {
      res.send({
        orgs
      });
    });
  });
});

process.on("SIGINT", function() {
  redisClient.quit();
  console.log("redis client quit");
});
