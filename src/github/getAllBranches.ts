import * as graphqlRequest from 'graphql-request';
import { readFileSync } from 'fs';
import { BranchModel } from './models/branch';
import dotenv = require('dotenv');
dotenv.config();

// Returns all branches of a given repository
export async function getAllBranches(orgId): Promise<BranchModel[]> {
  // Does user have permission to view org?
  const query = readFileSync(__dirname + '/getAllBranches.graphql', 'utf8');
  const data = await graphqlRequest.request(process.env.DATABASE_API, query, {
    id: orgId,
  });
  const branches: BranchModel[] = [];
  data.orgById.reposByOrgId.nodes.forEach(branch =>
    branches.push(
      new BranchModel(
        branch.branchesByRepoId.edges[0].node.name,
        branch.branchesByRepoId.edges[0].node.id,
        branch.branchesByRepoId.edges[0].node.lastCommitDate,
        branch.branchesByRepoId.edges[0].node.protected,
      ),
    ),
  );
  return branches;
}
