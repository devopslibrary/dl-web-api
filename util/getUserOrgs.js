
import getUserGithubToken from './getUserGithubToken';
const request = require("request-promise");

// Returns all orgs that a user belongs to (provided they allow us to get that info!)
async function getUserOrgs(githubUserSub) {
  const github_token = await getUserGithubToken(githubUserSub);
  let options = {
    method: 'GET',
    url: 'https://api.github.com/user/orgs',
    headers: {'content-type': 'application/json', authorization: 'token ' + github_token, 'User-Agent': 'kondo.io'}
  };
  let result = await request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });
  return JSON.parse(result);

}

export default getUserOrgs;
