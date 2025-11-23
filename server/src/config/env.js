import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  MONGODB_URI: process.env.MONGODB_URI,
};

if (!env.MONGODB_URI) {
  console.warn('⚠️  Missing MONGODB_URI in .env');
}
