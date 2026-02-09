import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { campus } from './routes/campusRoutes.js';
import { product } from './routes/productRoutes.js';
import { user } from './routes/userRoutes.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(cors({origin: true}));
  app.use(morgan('dev'));
  app.use('/api/user', user);
  app.use('/api/campuses', campus);
  app.use('/api/campuses/:slug/products', product);
  app.use((req, res) => res.status(404).json({error: 'URL_NOT_FOUND'}))
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({error: err.message || 'server_error'})
  })
  return app;
}