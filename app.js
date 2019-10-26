const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
import getUserOrgs from './util/getUserOrgs';


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

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  getUserOrgs(req.user.sub).then(
    function(orgs) {
    res.send({
      orgs,
    });
  });
});

app.use(express.json());

app.listen(3001, () => console.log('API listening on 3001'));
