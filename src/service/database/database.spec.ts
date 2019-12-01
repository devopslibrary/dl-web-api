import 'reflect-metadata';
import { Database } from './database';
import { ConfigService } from '../config/config.service';
const path = require('path');

const projectRoot = path.join(__dirname, '../../');
const config = new ConfigService(projectRoot + 'tests/fixtures/env.test');
const db = new Database(config);

test('Given a database connection, should successfullly be able to query', async () => {
  const query = await db.query('SELECT NOW() as now');
  expect(query).toBeDefined();
});

afterAll(() => {
  db.close();
});
