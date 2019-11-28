import { getAllBranches } from './getAllBranches';
import { BranchModel } from '../../models/branch';

// Grab non-stale date
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
const nonStaleDate = yyyy + '-' + mm + '-' + dd + 'T01:29:19.541+00:00';

// Mock the Query
const apiQuery = async function(filename, args) {
  const fakeData =
    `{"orgByName": {
            "reposByOrgId": {
              "nodes": [
                {
                  "branchesByRepoId": {
                    "edges": [
                      {
                        "node": {
                          "id": "HEL6Q29tbWl0MTQ5OTQxNjc2OmVmMGNmNmEzZmQ0MGQ2NjBlNDUwMTNhODIxZDg0YTIyYTY5MmE0MWI=",
                          "lastCommitDate": "2014-11-25T01:29:19.541+00:00",
                          "name": "feature/Super-Stale-Branch",
                          "repoId": 1122,
                          "protected": false,
                          "nodeId": "WyJCcmFuY2hlcyIsIkhFTDZRMjl0YldsME1UUTVPVFF4TmpjMk9tVm1NR05tTm1FelptUTBNR1EyTmpCbE5EVXdNVE5oT0RJeFpEZzBZVEl5WVRZNU1tRTBNV0k9Il0=",
                          "lastSynced": "2019-11-25T01:29:19.541+00:00"
                        }
                      },
                      {
                        "node": {
                          "id": "MADEUPID",
                          "lastCommitDate": "` +
    nonStaleDate +
    `",
                          "name": "hotfix/not-stale",
                          "repoId": 1155,
                          "protected": false,
                          "nodeId": "TESTNODEID",
                          "lastSynced": "2019-11-25T01:29:19.541+00:00"
                        }
                      },
                      {
                        "node": {
                          "id": "TYPICALPROTECTEDBRANCH",
                          "lastCommitDate": "2015-11-25T01:29:19.541+00:00",
                          "name": "develop",
                          "repoId": 1122,
                          "protected": true,
                          "nodeId": "pCbE5EVXdNVE5oT0RJeFpEZzBZVEl5WVRZNU1tRTBNV0k9Il0=",
                          "lastSynced": "2012-11-25T01:29:19.541+00:00"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }}`;
  return JSON.parse(fakeData);
};

test('Given an old non-default branch, should return as stale', async () => {
  const branches: BranchModel[] = await getAllBranches(
    apiQuery,
    'devopslibrary',
  );
  expect(branches[0].stale).toBe(true);
});

test('Given a set of branches, should return right properties', async () => {
  const branches: BranchModel[] = await getAllBranches(
    apiQuery,
    'devopslibrary',
  );
  expect(branches[0].id).toBe(
    'HEL6Q29tbWl0MTQ5OTQxNjc2OmVmMGNmNmEzZmQ0MGQ2NjBlNDUwMTNhODIxZDg0YTIyYTY5MmE0MWI=',
  );
  expect(branches[0].isProtected).toBe(false);
  expect(branches[0].lastCommitDate).toBe('2014-11-25T01:29:19.541+00:00');
  expect(branches[0].name).toBe('feature/Super-Stale-Branch');
});

test('Given a new branch, should return as NOT stale', async () => {
  const branches: BranchModel[] = await getAllBranches(
    apiQuery,
    'devopslibrary',
  );
  expect(branches[1].stale).toBe(false);
});

test('Given a non-protected branch, should return as NOT protected', async () => {
  const branches: BranchModel[] = await getAllBranches(
    apiQuery,
    'devopslibrary',
  );
  expect(branches[1].isProtected).toBe(false);
});

test('Given a protected branch, should return as protected', async () => {
  const branches: BranchModel[] = await getAllBranches(
    apiQuery,
    'devopslibrary',
  );
  expect(branches[2].isProtected).toBe(true);
});
