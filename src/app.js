const pinoHttp = require('pino-http');
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const express = require('express');
const cors = require('cors');
const logger = require('./shared/utils/logger');
const { WebError } = require('./shared/utils/ApiError');
const config = require('./shared/config');
const helmet = require('helmet');
const path = require('path');
const app = express();
app.set('etag', false);
const helmetOptions = {
  // 1. Disable CSP if you aren't serving HTML/Assets
  // This prevents overhead and "Refused to execute script" errors in browsers
  contentSecurityPolicy: false,

  // 2. Cross-Origin Resource Policy
  // Prevents other sites from reading your API responses in certain contexts
  crossOriginResourcePolicy: { policy: 'cross-origin' },

  // 3. Strict Transport Security (HSTS)
  // CRITICAL for APIs: ensures the mobile app/frontend always uses HTTPS
  hsts: config.env
    ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      }
    : false,

  // 4. Frameguard
  // Even for APIs, this prevents your JSON from being loaded in an iframe
  frameguard: { action: 'deny' },
};
app.use(helmet(helmetOptions));

// cors for cors

const corsOptions = {
  origin: [
    config.frontendUrl,
    'https://diwan-online-book-store-frontend.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
  credentials: true,
  maxAge: 86400,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

//add rate limit
app.use(require('./shared/middleware/ratelimiter').limiter);

app.use(bodyParserErrorHandler());
app.use(require('./routes'));
app.get('/', (req, res) => res.send('API is running'));

/*Serve Angular files
app.use(express.static(path.join(__dirname, '../public')));

// Angular fallback
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
*/

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error instanceof WebError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }
  console.error(error);
  res.sendStatus(500);
});

module.exports = app;
