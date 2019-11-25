import { apiQuery } from '../infra/apiHelper/index';
import { getOrgs } from '../github/getOrgs';
import { getRepos } from '../github/getRepos';
import { getAllBranches } from '../github/getAllBranches';
import { controller, httpGet } from 'inversify-express-utils';
import { Request } from 'express';

@controller('/orgs')
export class OrgController {
  // constructor(@inject(TYPES.UserService) private userService: UserService) {}

  // Retrieve all Organizations
  @httpGet('/')
  public async getAllOrganizations(request: Request) {
    if (!request.session.orgs) {
      const orgs = await getOrgs(apiQuery, request.session.token);
      request.session.orgs = orgs;
    }
    return request.session.orgs;
  }

  // Retrieve all Repositories
  @httpGet('/:org/repos')
  public getOrgRepos(request: Request) {
    return getRepos(request.params.org, request.session.token);
  }

  // Retrieve all Branches for an Org
  @httpGet('/:org/branches')
  public getAllBranches(request: Request) {
    return getAllBranches(apiQuery, request.params.org);
  }
}
