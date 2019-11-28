import { getRepos } from './getRepos';
import { getUser } from './getUser';
import { getManagementApiToken } from '../../infra/auth0/getManagementApiToken';

test('Given an organization, should return repositories', async () => {
  const authToken = await getManagementApiToken();
  const githubUser = await getUser(authToken, '5382669');
  const repos = await getRepos('devopslibrary', githubUser.token);
  expect(repos[0].defaultBranch).toBeDefined();
  expect(repos[0].id).toBeDefined();
  expect(repos[0].name).toBeDefined();
  expect(repos[0].orgId).toBeDefined();
});
