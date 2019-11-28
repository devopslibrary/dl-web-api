export class RepoModel {
  //Fields
  name: string;
  id: number;
  orgId: number;
  defaultBranch: string;

  constructor(name: string, id: number, orgId: number, defaultBranch: string) {
    this.name = name;
    this.id = id;
    this.orgId = orgId;
    this.defaultBranch = defaultBranch;
  }
}
