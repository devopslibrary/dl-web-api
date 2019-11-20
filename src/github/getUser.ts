import request = require('request-promise');

// Returns a Github User (including the access_token!)
export async function getUser(authToken, userId) {
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
  return JSON.parse(result);
}
