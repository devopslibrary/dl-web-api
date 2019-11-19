import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { ConfigService } from '../config/config.service';

// Set up Auth0 configuration
let config: ConfigService = new ConfigService(
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
