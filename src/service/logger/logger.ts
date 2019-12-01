import pino = require('pino');

export const logger = pino({
  name: 'dl-web-api',
  level: process.env.LEVEL || 'info',
});
