import { getAuthToken } from './getAuthToken';
import { getManagementApiToken } from './getManagementApiToken';

test('Given a Github User, should return Github Auth Token', async () => {
  const authToken = await getManagementApiToken();
  const githubToken = await getAuthToken(authToken, '5382669');
  expect(githubToken.toString().length).toEqual(40);
});
