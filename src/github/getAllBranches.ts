import * as graphqlRequest from 'graphql-request';
import { readFileSync } from 'fs';
import { BranchModel } from './models/branch';
import dotenv = require('dotenv');
import moment = require('moment');
dotenv.config();

// Returns all branches of a given repository
export async function getAllBranches(orgName): Promise<BranchModel[]> {
  // Does user have permission to view org?
  const query = readFileSync(__dirname + '/getAllBranches.graphql', 'utf8');
  const data = await graphqlRequest.request(process.env.DATABASE_API, query, {
    name: orgName,
  });
  const branches: BranchModel[] = [];
  data.orgByName.reposByOrgId.nodes.forEach(repoData => {
    repoData.branchesByRepoId.edges.forEach(branchData => {
      const branch = branchData.node;
      let stale: boolean;
      if (moment().diff(branch.lastCommitDate, 'days') > 90) {
        this.stale = true;
      } else {
        this.stale = false;
      }

      branches.push(
        new BranchModel(
          branch.name,
          branch.id,
          branch.lastCommitDate,
          branch.protected,
          this.stale,
        ),
      );
    });
  });
  return branches;
}
