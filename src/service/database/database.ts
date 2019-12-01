// Graphql Connection
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ConfigService } from '../config/config.service';
const { Client } = require('pg');
import { logger } from '../logger/logger';
const log = logger.child({ module: 'database' });

// This is used to wrap the Kondo (Postgraphile) backend API Service
@provide(Database)
export class Database {
  private client = new Client({
    host: this.config.get('DATABASE_HOST'),
    database: this.config.get('DATABASE_NAME'),
    user: this.config.get('DATABASE_USER'),
    password: this.config.get('DATABASE_PASSWORD'),
  });

  constructor(@inject(ConfigService) private config) {
    this.client.connect(err => {
      if (err) {
        log.error('Postgres DB connection error', err.stack);
      } else {
        log.info('Connected to Postgres');
      }
    });
  }
  public async query(query): Promise<JSON> {
    const data = await this.client.query(query);
    return data.rows;
  }
  public close() {
    this.client.end();
  }
}
