import 'reflect-metadata';
import { OrgModel } from '../../models/org';
import { OrgSettings } from './orgSettings';
import { Setting } from './settingEnum';

// ---------------------------
// Test retrieving settings
// ---------------------------

// Mock an Org
const fakeOrg = new OrgModel('org', 11233903, true, 'A', 'B', 'C');

test('If setting is false, return false', async () => {
  // Mock the Database
  class dbWithSettingsAllFalse {
    public async query(query): Promise<JSON> {
      const fakeData = `[
        {
          "orgId": 11233903,
          "nukeStaleBranches": false,
          "nukeStalePRs": false,
          "createdAt": "2019-12-01T23:34:15.657Z",
          "updatedAt": "2019-12-01T23:34:15.657Z"
        }
      ]`;
      return JSON.parse(fakeData);
    }
  }
  const settings = new OrgSettings(new dbWithSettingsAllFalse());
  const stale = await settings.getSetting(Setting.nukeStaleBranches, fakeOrg);
  expect(stale).toBe(false);
});

test('If setting is true, return true', async () => {
  // Mock the Database
  class dbWithSettingsAllFalse {
    public async query(query): Promise<JSON> {
      const fakeData = `[
        {
          "orgId": 11233904,
          "nukeStaleBranches": true,
          "nukeStalePRs": false,
          "createdAt": "2019-12-01T23:34:15.657Z",
          "updatedAt": "2019-12-01T23:34:15.657Z"
        }
      ]`;
      return JSON.parse(fakeData);
    }
  }
  const settings = new OrgSettings(new dbWithSettingsAllFalse());
  const stale = await settings.getSetting(Setting.nukeStaleBranches, fakeOrg);
  expect(stale).toBe(true);
});

test('If setting has never been set, return false', async () => {
  // Mock the Database
  class dbWithSettingsAllFalse {
    public async query(query): Promise<JSON> {
      const fakeData = `[]`;
      return JSON.parse(fakeData);
    }
  }
  const settings = new OrgSettings(new dbWithSettingsAllFalse());
  const stale = await settings.getSetting(Setting.nukeStaleBranches, fakeOrg);
  expect(stale).toBe(false);
});

test('Resolve two different settings successfully', async () => {
  // Mock the Database
  class dbWithSettingsAllFalse {
    public async query(query): Promise<JSON> {
      const fakeData = `[
        {
          "orgId": 11233904,
          "nukeStaleBranches": true,
          "nukeStalePRs": false,
          "createdAt": "2019-12-01T23:34:15.657Z",
          "updatedAt": "2019-12-01T23:34:15.657Z"
        }
      ]`;
      return JSON.parse(fakeData);
    }
  }
  const settings = new OrgSettings(new dbWithSettingsAllFalse());
  const staleb = await settings.getSetting(Setting.nukeStaleBranches, fakeOrg);
  const stalep = await settings.getSetting(Setting.nukeStalePRs, fakeOrg);
  expect(staleb).toBe(true);
  expect(stalep).toBe(false);
});
