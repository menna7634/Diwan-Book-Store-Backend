const pinoHttp = require('pino-http');
const express = require('express');
const logger = require('./shared/utils/logger');
const { WebError } = require('./shared/utils/ApiError');

const app = express();

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('API is running'));


// eslint-disable-next-line no-unused-vars
app.use(async (error, req, res, next) => {
  if(error instanceof WebError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return ;
  }
  console.error(error);
  res.sendStatus(500);

});

module.exports = app;
