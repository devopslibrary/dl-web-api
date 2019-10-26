const request = require("request-promise");

// Management API Token, used to look up users on Auth0 and to find the Github access tokens for a user.
async function getManagementApiToken() {
  let options = {
    method: 'POST',
    url: 'https://devopslibrary.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_CLIENT_AUDIENCE
    }
  };
  let result = await request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });

  return JSON.parse(result).access_token;
}

module.exports = getManagementApiToken;
