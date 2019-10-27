const request = require("request-promise");

// Returns a Github User (including the access_token!)
async function getGithubUser(authToken, userId) {
  let options = {
    method: "GET",
    url: "https://devopslibrary.auth0.com/api/v2/users/github|" + userId,
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + authToken
    }
  };
  let result = await request(options, function(error, response, body) {
    if (error) throw new Error(error);
  });
  return JSON.parse(result);
}
module.exports = getGithubUser;
