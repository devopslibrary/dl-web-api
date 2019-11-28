export class UserModel {
  //Fields
  name: string;
  email: string;
  nickname: string;
  userId: string;
  token: string;

  constructor(
    name: string,
    email: string,
    nickname: string,
    userId: string,
    token: string,
  ) {
    this.name = name;
    this.email = email;
    this.nickname = nickname;
    this.userId = userId;
    this.token = token;
  }
}
