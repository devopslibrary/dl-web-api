import { getUser } from './getUser';
import { getManagementApiToken } from '../auth0/getManagementApiToken';
import { UserModel } from './models/user';
import { OrgModel } from './models/org';
import { getOrgs } from './getOrgs';

test('Given a real ID, should return a proper Github User', async () => {
  const authToken = await getManagementApiToken();
  const user: UserModel = await getUser(authToken, '5382669');
  const orgs: OrgModel[] = await getOrgs(user.token);
  expect(orgs[0].avatar).toBeDefined();
  expect(orgs[0].id).toBeDefined();
  expect(orgs[0].installationId).toBeDefined();
  expect(orgs[0].installed).toBeDefined();
  expect(orgs[0].name).toBeDefined();
  expect(orgs[0].nodeId).toBeDefined();
});
