import * as graphqlRequest from 'graphql-request';
import { readFileSync } from 'fs';
import dotenv = require('dotenv');
dotenv.config();
import { provide } from 'inversify-binding-decorators';
import TYPES from '../../constant/types';

// This is used to wrap the Kondo (Postgraphile) backend API Service
@provide(TYPES.KondoAPIService)
export class KondoAPIService {
  public async graphqlQuery(filename, args): Promise<JSON> {
    // Does user have permission to view org?
    const query = readFileSync(filename, 'utf8');
    const data = await graphqlRequest.request(
      process.env.DATABASE_API,
      query,
      args,
    );
    return data;
  }
}
