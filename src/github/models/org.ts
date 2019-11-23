export class OrgModel {
  //Fields
  name: string;
  id: number;
  installed: boolean;
  installationId: string;
  nodeId: string;
  avatar: string;

  constructor(
    name: string,
    id: number,
    installed: boolean,
    installationId: string,
    nodeId: string,
    avatar: string,
  ) {
    this.name = name;
    this.id = id;
    this.installed = installed;
    this.installationId = installationId;
    this.nodeId = nodeId;
    this.avatar = avatar;
  }
}
