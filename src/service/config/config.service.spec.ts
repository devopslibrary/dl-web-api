import 'reflect-metadata';
import { ConfigService } from './config.service';
const path = require('path');

test('The settings service should return settings successfully', async () => {
  const config = new ConfigService(
    path.join(__dirname, '../../tests/fixtures/env.test'),
  );
  expect(config.get('DATABASE_NAME')).toBe('kondo');
});
