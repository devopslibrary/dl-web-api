const getGithubUser = require("./getGithubUser");
const getManagementApiToken = require("../auth0/getManagementApiToken");
var errors = require("request-promise/errors");

test("Given a real ID, should return a proper Github User", async () => {
  const authToken = await getManagementApiToken.token;
  const result = await getGithubUser(authToken, "5382669");
  expect(result.email).toEqual("ken@devopslibrary.com");
  expect(result.identities[0].access_token).toBeDefined();
  expect(result.name).toEqual("Ken Erwin");
});

test("Given a bad ID, should return an error", async () => {
  const auth0_token = await getManagementApiToken.token;
  try {
    const result = await getGithubUser(auth0_token, "1234567");
  } catch (error) {
    expect(error).toBeInstanceOf(errors.StatusCodeError);
  }
});
