import getUserGithubToken from './getUserGithubToken';

const request = require("request-promise");

// Returns all orgs that a user belongs to (provided they allow us to get that info!)
async function getUserOrgs(req, mgmtToken) {
  if (!req.session.githubOrgs) {
    const github_token = await getUserGithubToken(req, mgmtToken);
    let options = {
      method: 'GET',
      url: 'https://api.github.com/user/orgs',
      headers: {'content-type': 'application/json', authorization: 'token ' + github_token, 'User-Agent': 'kondo.io'}
    };
    let result = await request(options, function (error, response, body) {
      if (error) throw new Error(error);
    });
    req.log.info('Retrieved Github Orgs for user directly from Github API');
    req.session.githubOrgs = JSON.parse(result)
  }
  req.log.info('Returned Github Orgs for user');
  return req.session.githubOrgs;
}

export default getUserOrgs;
