import dotenv from 'dotenv';
dotenv.config({path: ""});

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
};

if (!env.MONGODB_URI) {
  console.warn('⚠️  Missing MONGODB_URI in .env');
}
if (!env.JWT_SECRET_KEY) console.log('No JWT_SECRET_KEY found');