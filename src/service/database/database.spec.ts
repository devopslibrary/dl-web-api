import 'reflect-metadata';
import { Database } from './database';
import { ConfigService } from '../config/config.service';
const path = require('path');

const config = new ConfigService(
  path.join(__dirname, '../../tests/fixtures/env.test'),
);
const db = new Database(config);

test('Given a database connection, should successfullly be able to query', async () => {
  const query = await db.query('SELECT NOW() as now');
  expect(query).toBeDefined();
});

afterAll(() => {
  db.close();
});
