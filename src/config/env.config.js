import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  REDIS_URL: process.env.REDIS_URL || "http://localhost:3000",
  
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,

  // PostgreSQL config
  DB: process.env.PSQL,

  // CLOUDINARY FOR IMAGES
  ClOUD_API_KEY: process.env.CLOUDINARY_API_KEY,
  ClOUD_API_SECRET_KEY: process.env.CLOUDINARY_API_SECRET_KEY,
  ClOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
};
