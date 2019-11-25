import * as graphqlRequest from 'graphql-request';
import { readFileSync } from 'fs';
import dotenv = require('dotenv');
import moment = require('moment');
dotenv.config();

// Graphql query wrapper, makes testing easier
// Example args
// {
//   name: orgName,
// }
export async function apiQuery(filename, args): Promise<JSON> {
  // Does user have permission to view org?
  const query = readFileSync(filename, 'utf8');
  const data = await graphqlRequest.request(
    process.env.DATABASE_API,
    query,
    args,
  );
  return data;
}
