import request = require('request-promise');

// Retrieves Management API Token, which is used to look up users on Auth0
export async function getManagementApiToken() {
  const options = {
    method: 'POST',
    url: 'https://devopslibrary.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_CLIENT_AUDIENCE,
    },
  };
  const result = await request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }
  });

  return JSON.parse(result).access_token;
}
