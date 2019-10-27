const getGithubUserOrgs = require("./getGithubUserOrgs");
const getGithubUser = require("./getGithubUser");
const getManagementApiToken = require("../auth0/getManagementApiToken");

test("Given a user, should return all orgs both private and public that they are a part of", async () => {
  const authToken = await getManagementApiToken.token;
  const githubUser = await getGithubUser(authToken, "5382669");
  const githubOrgs = await getGithubUserOrgs(
    githubUser.identities[0].access_token
  );

  expect(githubOrgs[0]).toHaveProperty("id");
  expect(githubOrgs[0]).toHaveProperty("login");
  expect(githubOrgs[0]).toHaveProperty("node_id");
  expect(githubOrgs[0]).toHaveProperty("url");
  expect(githubOrgs[0]).toHaveProperty("repos_url");
  expect(githubOrgs[0]).toHaveProperty("events_url");
  expect(githubOrgs[0]).toHaveProperty("hooks_url");
  expect(githubOrgs[0]).toHaveProperty("issues_url");
  expect(githubOrgs[0]).toHaveProperty("members_url");
  expect(githubOrgs[0]).toHaveProperty("public_members_url");
  expect(githubOrgs[0]).toHaveProperty("avatar_url");
  expect(githubOrgs[0]).toHaveProperty("description");
  expect(githubOrgs[0]).toHaveProperty("installed");
});
