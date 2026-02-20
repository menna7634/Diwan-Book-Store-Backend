const pinoHttp = require('pino-http');
const express = require('express');
const logger = require('./shared/utils/logger');

const app = express();

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('API is running'));

module.exports = app;
