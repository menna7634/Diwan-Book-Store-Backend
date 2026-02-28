const pino = require('pino');
const config = require('../config');

const logger = pino({
  level: config.logger.level || 'info',
  enabled: config.logger.enabled,
  name: "diwan-bs",
  redact: ['password', 'req.headers.authorization'],
  transport: {
    targets: [
      {
        target: 'pino/file',
        level: config.logger.level || 'info',
        options: { destination: './app.log' }
      },
      {
        target: 'pino-pretty',
        level: config.logger.level || 'info',
        options: { destination: 1, colorize: true }
      }
    ]
  }
});

module.exports = logger;
