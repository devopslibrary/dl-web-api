const getRepos = require("./getRepos");
const getUser = require("./getUser");
const getManagementApiToken = require("../auth0/getManagementApiToken");

test("Given a user, should return all orgs both private and public that they are a part of", async () => {
  const authToken = await getManagementApiToken.token;
  const githubUser = await getUser(authToken, "5382669");
  const repos = await getRepos(
    "devopslibrary",
    githubUser.identities[0].access_token
  );
  expect(repos[0]).toHaveProperty("name");
  expect(repos[0]).toHaveProperty("private");
  expect(repos[0]).toHaveProperty("id");
  expect(repos[0]).toHaveProperty("permissions");
});
