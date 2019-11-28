import request = require('request-promise');
import { UserModel } from '../../models/user';

// Returns a Github User (including the access_token!)
export async function getUser(authToken, userId): Promise<UserModel> {
  const options = {
    method: 'GET',
    url: 'https://devopslibrary.auth0.com/api/v2/users/github|' + userId,
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + authToken,
    },
  };
  const result = await request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }
  });
  const parsedJson = JSON.parse(result);
  return new UserModel(
    parsedJson.name,
    parsedJson.email,
    parsedJson.nickname,
    parsedJson.user_id,
    parsedJson.identities[0].access_token,
  );
}
