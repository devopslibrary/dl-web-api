import getManagementApiToken from './getManagementApiToken';
const request = require("request-promise");

// Management API Token, used to look up users on Auth0 and to find the Github access tokens for a user.
async function getUserGithubToken(githubUserSub) {
  const management_api_access_token = await getManagementApiToken();
    let options = {
      method: 'GET',
      url: 'https://devopslibrary.auth0.com/api/v2/users/' + githubUserSub,
      headers: {'content-type': 'application/json', authorization: 'Bearer ' + management_api_access_token}
    };
    let result = await request(options, function (error, response, body) {
      if (error) throw new Error(error);
    });
    return JSON.parse(result).identities[0].access_token;

}

export default getUserGithubToken;
