const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const pino = require('express-pino-logger')();
import getUserOrgs from './util/getUserOrgs';
import getManagementApiToken from './util/getManagementApiToken';
var session = require('express-session');


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
  secret: 'keyboard cat',
  cookie: {},
  resave: false,
  saveUninitialized: false
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess));
// End session code

// Add Logger (Pino)
app.use(pino);

// Get management token from Auth0
let management_api_access_token;
app.use(express.json());
app.listen(3001, async function(){
  console.log("App is ready");
  await getManagementApiToken().then(function(token) {
    management_api_access_token = token;
  });
});

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  getUserOrgs(req, management_api_access_token).then(
    function(orgs) {
    res.send({
      orgs,
    });
  });
});




