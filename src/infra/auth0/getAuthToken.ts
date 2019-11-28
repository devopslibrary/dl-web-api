import request = require('request-promise');

// Returns a Github Access_token!
export async function getAuthToken(authToken, userId) {
  const options = {
    method: 'GET',
    url: 'https://devopslibrary.auth0.com/api/v2/users/github|' + userId,
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + authToken,
    },
  };
  const result = await request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }
  });
  return JSON.parse(result).identities[0].access_token;
}
