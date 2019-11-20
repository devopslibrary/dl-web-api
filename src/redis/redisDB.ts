import asyncRedis = require('async-redis');

const client = asyncRedis.createClient({
  port: 6379,
  host: 'localhost',
});

module.exports = client;
