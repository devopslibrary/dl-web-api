import { inject } from 'inversify';
import { getRepos } from '../service/github/getRepos';
import { getOrgs } from '../service/github/getOrgs';
import { getAllBranches } from '../service/github/getAllBranches';
import { controller, httpGet } from 'inversify-express-utils';
import { Request } from 'express';
import { KondoAPIService } from '../service/kondoAPIService/index';

@controller('/orgs')
export class OrgController {
  constructor(
    @inject(KondoAPIService) private kondoAPIService: KondoAPIService,
  ) {}

  // Retrieve all Organizations
  @httpGet('/')
  public async getAllOrganizations(request: Request) {
    if (!request.session.orgs) {
      const orgs = await getOrgs(
        this.kondoAPIService.graphqlQuery,
        request.session.token,
      );
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
    return getAllBranches(
      this.kondoAPIService.graphqlQuery,
      request.params.org,
    );
  }
}
