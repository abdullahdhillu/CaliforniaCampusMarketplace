import mongoose from 'mongoose';

import {createApp} from './app.js';
import {env} from './config/env.js';
import {campus} from './routes/campusRoutes.js';

const app = createApp();
const port = env.PORT;
async function start() {
  try {
    mongoose.connect(env.MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => console.error('❌ MongoDB connection error:', err));
    app.listen(port, () => {
      console.log(`🚀 API listening on http://localhost:${port}`);
    })
  } catch (e) {
    console.log('Failed_to_start');
    process.exit(1);
  }
}
start();