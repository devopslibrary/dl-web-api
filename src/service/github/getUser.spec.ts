import { getUser } from './getUser';
import { getManagementApiToken } from '../auth0/getManagementApiToken';
import { UserModel } from '../../models/user';
import errors = require('request-promise/errors');

test('Given a real ID, should return a proper Github User', async () => {
  const authToken = await getManagementApiToken();
  const user: UserModel = await getUser(authToken, '5382669');
  expect(user.email).toEqual('ken@devopslibrary.com');
  expect(user.token).toBeDefined();
  expect(user.name).toEqual('Ken Erwin');
  expect(user.nickname).toEqual('kenerwin88');
  expect(user.userId).toEqual('github|5382669');
});

test('Given a bad ID, should return an error', async () => {
  const auth0_token = await getManagementApiToken();
  try {
    await getUser(auth0_token, '1234567');
  } catch (error) {
    expect(error).toBeInstanceOf(errors.StatusCodeError);
  }
});
