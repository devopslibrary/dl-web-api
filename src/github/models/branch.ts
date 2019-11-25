export class BranchModel {
  //Fields
  name: string;
  id: number;
  lastCommitDate: Date;
  isProtected: boolean;
  stale: boolean;

  constructor(
    name: string,
    id: number,
    lastCommitDate: Date,
    isProtected: boolean,
    stale: boolean,
  ) {
    this.name = name;
    this.id = id;
    this.lastCommitDate = lastCommitDate;
    this.isProtected = isProtected;
    this.stale = stale;
  }
}
