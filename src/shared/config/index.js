const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  MONGODB_URL: Joi.string().required().description('MongoDB connection string'),

  JWT_SECRET: Joi.string().min(10).required().description('JWT secret key'),

  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),

  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  mongoose: {
    url: envVars.MONGODB_URL,
  },

  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
};

module.exports = config;
