import { getUser } from './getUser';
import { getManagementApiToken } from '../auth0/getManagementApiToken';
import errors = require('request-promise/errors');

test('Given a real ID, should return a proper Github User', async () => {
  const authToken = await getManagementApiToken();
  const result = await getUser(authToken, '5382669');
  expect(result.email).toEqual('ken@devopslibrary.com');
  expect(result.identities[0].access_token).toBeDefined();
  expect(result.name).toEqual('Ken Erwin');
});

test('Given a bad ID, should return an error', async () => {
  const auth0_token = await getManagementApiToken();
  try {
    const result = await getUser(auth0_token, '1234567');
  } catch (error) {
    expect(error).toBeInstanceOf(errors.StatusCodeError);
  }
});
