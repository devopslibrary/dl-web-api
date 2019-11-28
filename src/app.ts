import express = require('express');
import * as session from 'express-session';
import jwt = require('express-jwt');
import jwksRsa = require('jwks-rsa');
import redis = require('redis');
import dotenv = require('dotenv');
import * as connectRedis from 'connect-redis';
import { ConfigService } from './infra/config/config.service';
import { getToken } from './service/github/getToken';
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();
dotenv.config();
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import TYPES from './constant/types';

// Inversion of Control Container
// the @provide() annotation will then automatically register them.
import './ioc/loader';
import { Container } from 'inversify';
import { KondoAPIService } from './service/kondoAPIService/index';
const container = new Container();
container.bind<KondoAPIService>(TYPES.KondoAPIService).to(KondoAPIService);

// Create a new Express app
const server = new InversifyExpressServer(container);

// Config
const config: ConfigService = new ConfigService(
  `${process.env.NODE_ENV || 'development'}.env`,
);

// Logging
import pino = require('pino');
import expressPino = require('express-pino-logger');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

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

// Use session https://github.com/expressjs/session
const sess = {
  store: new RedisStore({ client: redisClient }),
  secret: 'I like Santa',
  cookie: {},
  resave: false,
  saveUninitialized: false,
};

// Server Config
server.setConfig(app => {
  app.use(expressLogger); // Logger
  app.use(checkJwt); // JWT Middleware
  app.use(express.json()); // Automatic JSON parsing middleware

  // Session code
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
  }
  app.use(session(sess));
  // End session code

  app.use(getToken); // Github Token Middleware, MUST be after Session code!
});

// Start Server
const app = server.build();
app.listen(3000);
console.log('Server started on port 3000 :)');
exports = module.exports = app;

// Close Redis on Death
process.on('SIGINT', function() {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  redisClient.quit();
  process.exit(1);
});
