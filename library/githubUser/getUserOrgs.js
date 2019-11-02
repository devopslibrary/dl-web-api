const request = require("request-promise");
const graphqlRequest = require('graphql-request').request
const {readFileSync} = require('fs')
require('dotenv').config()

// Returns all orgs that a user belongs to (provided they allow us to get that info!)
async function getUserOrgs(githubToken) {
  // Retrieve Orgs from Github
  let options = {
    method: "GET",
    url: "https://api.github.com/user/orgs",
    headers: {
      "content-type": "application/json",
      authorization: "token " + githubToken,
      "User-Agent": "kondo.io"
    }
  };
  let result = await request(options, function(error, response, body) {
    if (error) throw new Error(error);
  });
  const orgs = await JSON.parse(result);

  // Match that data with what we have stored in the database
  return await Promise.all(
    orgs.map(async org => {
      // Get Orgs from Database
      const query = readFileSync(__dirname + '/getOrg.graphql', 'utf8')
      const data = await graphqlRequest(process.env.DATABASE_API, query, {
        id: org.id,
      });
      if (data.orgById) {
        org.installed = true;
        org.install_id = data.id;
      } else {
        org.installed = false;
        org.install_id = null;
      }
      return org;
    })
  );
}

module.exports = getUserOrgs;
