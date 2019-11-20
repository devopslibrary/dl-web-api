import request = require('request-promise');
import * as graphqlRequest from 'graphql-request';
import { readFileSync } from 'fs';
import dotenv = require('dotenv');
dotenv.config();

// Returns all orgs that a user belongs to (provided they allow us to get that info!)
export async function getUserOrgs(githubToken) {
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
      const query = readFileSync(__dirname + '/getOrg.graphql', 'utf8');
      const data = await graphqlRequest.request(
        process.env.DATABASE_API,
        query,
        {
          id: org.id,
        },
      );
      if (data.orgById) {
        org.installed = true;
        org.install_id = data.id;
      } else {
        org.installed = false;
        org.install_id = null;
      }
      return org;
    }),
  );
}