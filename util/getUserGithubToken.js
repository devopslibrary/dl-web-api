const request = require("request-promise");

// Management API Token, used to look up users on Auth0 and to find the Github access tokens for a user.
async function getUserGithubToken(req, mgmtToken) {
  if (!req.session.githubToken) {
    let options = {
      method: 'GET',
      url: 'https://devopslibrary.auth0.com/api/v2/users/' + req.user.sub,
      headers: {'content-type': 'application/json', authorization: 'Bearer ' + mgmtToken}
    };
    let result = await request(options, function (error, response, body) {
      if (error) throw new Error(error);
    });
    req.log.info('Retrieved Github Token for user directly from Github API (Should be only once per user)');
    req.session.githubToken = JSON.parse(result).identities[0].access_token;
  }
  req.log.info('Retrieved Github Token for user from Session state');
  return req.session.githubToken;
}

export default getUserGithubToken;
