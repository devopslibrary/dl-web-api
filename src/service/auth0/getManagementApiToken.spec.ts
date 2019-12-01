import { getManagementApiToken } from './getManagementApiToken';
import jwtDecode = require('jwt-decode');

test('Should return a proper Auth0 JWT with proper value', async () => {
  const result = await getManagementApiToken();
  const tokenPayload = jwtDecode(result);
  expect(tokenPayload).toHaveProperty('iat');
  expect(tokenPayload).toHaveProperty('exp');
  expect(tokenPayload).toHaveProperty('scope');
  expect(tokenPayload).toHaveProperty('sub');
});
