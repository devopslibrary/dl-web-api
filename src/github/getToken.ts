import { getUser } from './getUser';
import { getManagementApiToken } from '../auth0/getManagementApiToken';

export async function getToken(req, res, next) {
  if (!req.session.token) {
    const auth0ManagementToken = await getManagementApiToken();
    const userId = req.user.sub.split('|')[1];
    const githubUser = await getUser(auth0ManagementToken, userId);
    req.session.token = githubUser.token;
  }
  next();
}
