import mongoose from 'mongoose'

import {env} from '../src/config/env.js';
import {campusModel} from '../src/models/CampusModel.js';

const SEED = [
  {name: 'UCLA', slug: 'ucla', type: 'university', city: 'Los Angeles'},
  {
    name: 'UC Berkeley',
    slug: 'uc-berkeley',
    type: 'university',
    city: 'Berkeley'
  },
  {name: 'UC San Diego', slug: 'ucsd', type: 'university', city: 'San Diego'},
  {
    name: 'Stanford University',
    slug: 'stanford',
    type: 'university',
    city: 'Stanford'
  },
  {
    name: 'Lincoln High School (SF)',
    slug: 'lincoln-high-sf',
    type: 'high_school',
    city: 'San Francisco'
  },
];

async function run() {
  await mongoose.connect(env.MONGODB_URI);
  await campusModel.bulkWrite(
      SEED.map(c => ({
                 updateOne: {
                   filter: {slug: c.slug},
                   upsert: true,
                   update: {$set: {...c, state: c.state || 'CA'}},
                   ordered: true
                 }
               })))
  const count = await campusModel.countDocuments();
  console.log(`✅ Seeded campuses. Total: ${count}`);
  await mongoose.disconnect();
}
run().catch(e => {
  console.error(e);
  process.exit(1);
})
