const pinoHttp = require('pino-http');
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const express = require('express');
const cors = require('cors');
const logger = require('./shared/utils/logger');
const { WebError } = require('./shared/utils/ApiError');
const config = require('./shared/config');

const app = express();
const corsOptions = {
  origin: config.frontendUrl, // Use an environment variable!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};
app.use(cors(corsOptions));
app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParserErrorHandler());
app.use(require('./routes'));
app.get('/', (req, res) => res.send('API is running'));

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
