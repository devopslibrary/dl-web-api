export class BranchModel {
  //Fields
  name: string;
  id: number;
  lastCommitDate: Date;
  isProtected: boolean;

  constructor(
    name: string,
    id: number,
    lastCommitDate: Date,
    isProtected: boolean,
  ) {
    this.name = name;
    this.id = id;
    this.lastCommitDate = lastCommitDate;
    this.isProtected = isProtected;
  }
}
