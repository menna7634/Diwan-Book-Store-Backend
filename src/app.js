const pinoHttp = require('pino-http');

const logger = require('./shared/utils/logger');

app.use(pinoHttp({ logger }));
