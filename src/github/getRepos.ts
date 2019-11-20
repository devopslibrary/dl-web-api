import request = require('request-promise');
import dotenv = require('dotenv');
dotenv.config();

// Returns all orgs that a user belongs to (provided they allow us to get that info!)
export async function getRepos(orgName, githubToken) {
  // Retrieve Orgs from Github
  const options = {
    method: 'GET',
    url: 'https://api.github.com/orgs/' + orgName + '/repos',
    headers: {
      'content-type': 'application/json',
      'authorization': 'token ' + githubToken,
      'User-Agent': 'kondo.io',
    },
  };
  const result = await request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }
  });
  const repos = await JSON.parse(result);

  return repos;
}
