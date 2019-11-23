import { getAllBranches } from './getAllBranches';
import { BranchModel } from './models/branch';

test('Given an org, should return array of branches', async () => {
  const branches: BranchModel[] = await getAllBranches(11233903);
  expect(branches[0].id).toBeDefined();
  expect(branches[0].isProtected).toBeDefined();
  expect(branches[0].lastCommitDate).toBeDefined();
  expect(branches[0].name).toBeDefined();
});
