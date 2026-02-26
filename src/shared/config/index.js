const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  MONGODB_URL: Joi.string().required().description('MongoDB connection string'),
  FRONTEND_URL: Joi.string().default('http://localhost:4200'),

  JWT_SECRET: Joi.string().min(10).required().description('JWT secret key'),

  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),

  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),

  ENABLE_EMAIL_VERIFICATION: Joi.boolean().default(false),
  VERIFICATION_TOKEN_EXPIRATION_HOURS: Joi.number().integer().default(24),

  CLOUDINARY_CLOUD_NAME: Joi.string().required().description('Cloudinary cloud name'),
  CLOUDINARY_API_KEY: Joi.string().required().description('Cloudinary API key'),
  CLOUDINARY_API_SECRET: Joi.string().required().description('Cloudinary API secret'),
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
  frontendUrl: envVars.FRONTEND_URL,
  mongoose: {
    url: envVars.MONGODB_URL,
  },

  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },

  emailVerification: {
    isEnabled: envVars.ENABLE_EMAIL_VERIFICATION,
    tokenExpirationHours: envVars.VERIFICATION_TOKEN_EXPIRATION_HOURS,
  },

  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
};

module.exports = config;
