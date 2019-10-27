const request = require("request-promise");
const redisDB = require("../redis/redisDB");

// Returns all orgs that a user belongs to (provided they allow us to get that info!)
async function getAllGithubUserOrgs(githubToken) {
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

  return JSON.parse(result);
}

function getRedisData(orgs) {
  return Promise.all(
    orgs.map(async org => {
      const data = await redisDB.hgetall("ghorg:" + org.id);
      if (data) {
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

async function getGithubUserOrgs(githubToken) {
  const userOrgInfo = await getAllGithubUserOrgs(githubToken);
  return await getRedisData(userOrgInfo);
}

module.exports = getGithubUserOrgs;
