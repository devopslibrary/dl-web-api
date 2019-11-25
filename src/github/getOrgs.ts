import request = require('request-promise');
import dotenv = require('dotenv');
import { OrgModel } from './models/org';
dotenv.config();

// Returns all orgs that a user belongs to (provided they allow us to get that info!)
export async function getOrgs(apiQuery, githubToken): Promise<OrgModel[]> {
  // Retrieve Orgs from Github
  const options = {
    method: 'GET',
    url: 'https://api.github.com/user/orgs',
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
  const orgs = await JSON.parse(result);

  // Match that data with what we have stored in the database
  return await Promise.all(
    orgs.map(async org => {
      // Get Orgs from Database
      const data: any = await apiQuery(__dirname + '/getOrg.graphql', {
        id: org.id,
      });
      if (data.orgById) {
        org.installed = true;
        org.installationId = data.orgById;
      } else {
        org.installed = false;
        org.installationId = null;
      }
      return new OrgModel(
        org.login,
        org.id,
        org.installed,
        org.installationId,
        org.node_id,
        org.avatar_url,
      );
    }),
  );
}
