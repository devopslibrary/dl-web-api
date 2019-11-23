import * as pgPromise from 'pg-promise';
const pgp = pgPromise({
  /* Initialization Options */
});
const db = pgp('postgres://username:password@host:port/database');
export = db;
