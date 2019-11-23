import express = require('express');
import { getOrgs } from './src/github/getOrgs';
import { getRepos } from './src/github/getRepos';
import { getAllBranches } from './src/github/getAllBranches';
import * as session from 'express-session';
import jwt = require('express-jwt');
import jwksRsa = require('jwks-rsa');
import redis = require('redis');
import dotenv = require('dotenv');
import * as connectRedis from 'connect-redis';
import { ConfigService } from './src/config/config.service';
import { getToken } from './src/github/getToken';
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();
dotenv.config();

// Create a new Express app
const app: express.Application = express();

// Config
const config: ConfigService = new ConfigService(
  `${process.env.NODE_ENV || 'development'}.env`,
);

// Logging
import pino = require('pino');
import expressPino = require('express-pino-logger');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });
app.use(expressLogger);

// Global Middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.get('AUTH0_DOMAIN')}/.well-known/jwks.json`,
  }),

  audience: config.get('AUTH0_AUDIENCE'),
  issuer: `https://${config.get('AUTH0_DOMAIN')}/`,
  algorithm: ['RS256'],
});
app.use(checkJwt);

// Use session https://github.com/expressjs/session
const sess = {
  store: new RedisStore({ client: redisClient }),
  secret: 'I like Santa',
  cookie: {},
  resave: false,
  saveUninitialized: false,
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  // sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));
// End session code

// Start Express
app.use(express.json());
app.listen(3000, async () => {
  logger.info('App is ready');
});

// Token Middleware for Github Token Retrieval
app.use(getToken);

// Retrieve Org Information
app.get('/orgs', async (req: any, res) => {
  if (!req.session.orgs) {
    const orgs = await getOrgs(req.session.token);
    req.session.orgs = orgs;
  }
  req.log.info('Returning cached Github Orgs');
  res.send(req.session.orgs);
});

// Receive Repo Information
app.get('/orgs/:org/repos', async (req: any, res) => {
  const repos = await getRepos(req.params.org, req.session.token);
  res.send(repos);
});

// Receive Branch Information
app.get('/orgs/:org/branches', async (req: any, res) => {
  const branches = await getAllBranches(req.params.org);
  res.send(branches);
});

process.on('SIGINT', function() {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  redisClient.quit();
  // some other closing procedures go here
  process.exit(1);
});
