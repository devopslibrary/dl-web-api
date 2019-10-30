const getAuthToken = require("./getAuthToken");
const getManagementApiToken = require("../auth0/getManagementApiToken");

test("Given a Github User, should return Github Auth Token", async () => {
  const authToken = await getManagementApiToken.token;
  const githubToken = await getAuthToken(authToken, "5382669");
  expect(githubToken.toString().length).toEqual(40);
});
