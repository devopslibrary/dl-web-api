import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrgModel } from '../../models/org';
import { Setting } from './settingEnum';
import { Database } from '../database/database';
import { logger } from '../logger/logger';
const log = logger.child({ module: 'orgSetting' });

// This is used to wrap the Kondo (Postgraphile) backend API Service
@provide(OrgSettings)
export class OrgSettings {
  constructor(@inject(Database) private db) {}

  // Retrieve a setting
  public async getSetting(name: Setting, org: OrgModel): Promise<boolean> {
    const data: any = await this.db.query(
      'SELECT * FROM "Settings" WHERE "orgId" = ' + org.id,
    );
    switch (data.length) {
      case 0: {
        return false; // No settings found, so return false!
      }
      case 1: {
        return data[0][name];
      }
      default: {
        log.error('Settings table returned more than one row!');
        return false; // False is most safe!
      }
    }
  }

  // // Set a setting
  // public async setSetting(
  //   name: SETTINGS,
  //   org: OrgModel,
  //   value: boolean,
  // ): Promise<boolean> {
  //   switch (name) {
  //     case SETTINGS.NukeStaleBranches: {
  //       await this.kondoAPIService.graphqlQuery(
  //         __dirname + '/setNukeStaleBranches.graphql',
  //         {
  //           orgId: org.id,
  //         },
  //       );
  //     }
  //   }

  //   // If no settings found, return false by default
  //   if (data.allSettings.nodes.length == 0) {
  //     return false;
  //   }
  // }
}
