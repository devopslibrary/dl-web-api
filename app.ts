import express = require('express');
import { getOrgs } from './src/github/getOrgs';
import { getUser } from './src/github/getUser';
import { getRepos } from './src/github/getRepos';
import { getAllBranches } from './src/github/getAllBranches';
import { getManagementApiToken } from './src/auth0/getManagementApiToken';
import * as session from 'express-session';

import redis = require('redis');
import dotenv = require('dotenv');
import * as connectRedis from 'connect-redis';
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();
dotenv.config();

// Create a new Express app
const app: express.Application = express();

// Logging
import pino = require('pino');
import expressPino = require('express-pino-logger');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });
app.use(expressLogger);

// Define middleware that validates incoming bearer tokens
import jwt = require('express-jwt');
import jwksRsa = require('jwks-rsa');
import { ConfigService } from './src/config/config.service';

// Set up Auth0 configuration
const config: ConfigService = new ConfigService(
  `${process.env.NODE_ENV || 'development'}.env`,
);

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

// Get management token from Auth0
let authToken;
app.use(express.json());
app.listen(3000, async () => {
  logger.info('App is ready');
  await getManagementApiToken().then(token => {
    authToken = token;
  });
});

// Retrieve Org Information
app.get('/orgs', checkJwt, async (req: any, res) => {
  if (!req.session.orgs) {
    const userId = req.user.sub.split('|')[1];
    const githubUser = await getUser(authToken, userId);
    const githubToken = githubUser.token;
    const orgs = await getOrgs(githubToken);
    req.session.orgs = orgs;
  }
  req.log.info('Returning cached Github Orgs');
  res.send(req.session.orgs);
});

// Receive Repo Information
app.get('/orgs/:org/repos', checkJwt, async (req: any, res) => {
  const userId = req.user.sub.split('|')[1];
  const githubUser = await getUser(authToken, userId);
  const githubToken = githubUser.token;
  const repos = await getRepos(req.params.org, githubToken);
  res.send(repos);
});

// Receive Branch Information
app.get('/orgs/:org/branches', checkJwt, async (req: any, res) => {
  const branches = await getAllBranches(req.params.org);
  res.send(branches);
});

process.on('SIGINT', function() {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  redisClient.quit();
  // some other closing procedures go here
  process.exit(1);
});
