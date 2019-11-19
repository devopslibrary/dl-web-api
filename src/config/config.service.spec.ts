import { ConfigService } from './config.service';

describe('Config', () => {
  it('should be defined', () => {
    expect(new ConfigService('development.env')).toBeDefined();
  });
});
