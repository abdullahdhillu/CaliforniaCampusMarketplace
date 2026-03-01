import mongoose from 'mongoose';

import { env } from '../src/config/env.js';
import { campusModel } from '../src/models/CampusModel.js';

/** ---------- helpers to generate aliases ---------- */
const normalize = (s = '') =>
  s
    .toLowerCase()
    .normalize('NFD') // San José -> San Jose
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const uniq = (arr) => [...new Set(arr.filter(Boolean).map(normalize))];
const slugToWords = (slug = '') => normalize(slug.replace(/-/g, ' '));

/** add extra common acronyms / nicknames here over time */
const MANUAL_ALIASES = {
  'uc-berkeley': ['ucb', 'berkeley', 'cal', 'uc berkeley', 'university of california berkeley'],
  ucla: ['ucla', 'uc los angeles', 'university of california los angeles'],
  ucsd: ['ucsd', 'uc san diego', 'university of california san diego'],
  ucsf: ['ucsf', 'uc san francisco', 'university of california san francisco'],
  'uc-irvine': ['uci', 'uc irvine', 'university of california irvine'],
  'uc-santa-barbara': ['ucsb', 'uc santa barbara', 'university of california santa barbara'],
  'uc-santa-cruz': ['ucsc', 'uc santa cruz', 'university of california santa cruz'],
  'uc-riverside': ['ucr', 'uc riverside', 'university of california riverside'],

  sjsu: ['sjsu', 'san jose state', 'san jose state university'],
  sfsu: ['sfsu', 'san francisco state', 'san francisco state university'],
  sdsu: ['sdsu', 'san diego state', 'san diego state university'],

  usc: ['usc', 'university of southern california'],
  caltech: ['caltech', 'cal tech', 'california institute of technology'],
  lmu: ['lmu', 'loyola marymount', 'loyola marymount university'],
  oxy: ['oxy', 'occidental', 'occidental college'],
};

function buildAliases(c) {
  const nameNorm = normalize(c.name);
  const cityNorm = normalize(c.city);

  // Simplify the name to catch searches like "San Jose State" or "Poly Pomona"
  const simplified = nameNorm
    .replace(/\buniversity\b/g, '')
    .replace(/\bcalifornia\b/g, '')
    .replace(/\bstate\b/g, '')
    .replace(/\bcollege\b/g, '')
    .replace(/\bpolytechnic\b/g, '')
    .replace(/\binstitute\b/g, '')
    .replace(/\bof\b/g, '')
    .replace(/\bthe\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const manual = MANUAL_ALIASES[c.slug] || [];

  return uniq([
    c.slug, // exact slug
    slugToWords(c.slug), // slug as words
    c.name, // original name
    nameNorm, // normalized name
    simplified, // simplified name
    c.city, // city
    cityNorm, // normalized city
    ...manual,
  ]);
}

/** ---------- your seed ---------- */
const SEED = [
  // ========== UC SYSTEM (10 campuses) ==========
  { name: 'UC Berkeley', slug: 'uc-berkeley', type: 'university', city: 'Berkeley' },
  { name: 'UCLA', slug: 'ucla', type: 'university', city: 'Los Angeles' },
  { name: 'UC San Diego', slug: 'ucsd', type: 'university', city: 'San Diego' },
  { name: 'UC Davis', slug: 'uc-davis', type: 'university', city: 'Davis' },
  { name: 'UC Irvine', slug: 'uc-irvine', type: 'university', city: 'Irvine' },
  { name: 'UC Santa Barbara', slug: 'uc-santa-barbara', type: 'university', city: 'Santa Barbara' },
  { name: 'UC Santa Cruz', slug: 'uc-santa-cruz', type: 'university', city: 'Santa Cruz' },
  { name: 'UC Riverside', slug: 'uc-riverside', type: 'university', city: 'Riverside' },
  { name: 'UC Merced', slug: 'uc-merced', type: 'university', city: 'Merced' },
  { name: 'UC San Francisco', slug: 'ucsf', type: 'university', city: 'San Francisco' },

  // ========== CSU SYSTEM (23 campuses) ==========
  { name: 'California Polytechnic State University, San Luis Obispo', slug: 'cal-poly-slo', type: 'university', city: 'San Luis Obispo' },
  { name: 'California State Polytechnic University, Humboldt', slug: 'cal-poly-humboldt', type: 'university', city: 'Arcata' },
  { name: 'California State Polytechnic University, Pomona', slug: 'cal-poly-pomona', type: 'university', city: 'Pomona' },
  { name: 'San Diego State University', slug: 'sdsu', type: 'university', city: 'San Diego' },
  { name: 'San Francisco State University', slug: 'sfsu', type: 'university', city: 'San Francisco' },
  { name: 'San José State University', slug: 'sjsu', type: 'university', city: 'San Jose' },
  { name: 'California State University, Bakersfield', slug: 'csu-bakersfield', type: 'university', city: 'Bakersfield' },
  { name: 'California State University Channel Islands', slug: 'csu-channel-islands', type: 'university', city: 'Camarillo' },
  { name: 'California State University, Chico', slug: 'csu-chico', type: 'university', city: 'Chico' },
  { name: 'California State University, Dominguez Hills', slug: 'csudh', type: 'university', city: 'Carson' },
  { name: 'California State University, East Bay', slug: 'csueb', type: 'university', city: 'Hayward' },
  { name: 'California State University, Fresno', slug: 'fresno-state', type: 'university', city: 'Fresno' },
  { name: 'California State University, Fullerton', slug: 'csuf', type: 'university', city: 'Fullerton' },
  { name: 'California State University, Long Beach', slug: 'csulb', type: 'university', city: 'Long Beach' },
  { name: 'California State University, Los Angeles', slug: 'csula', type: 'university', city: 'Los Angeles' },
  { name: 'California State University, Monterey Bay', slug: 'csumb', type: 'university', city: 'Seaside' },
  { name: 'California State University, Northridge', slug: 'csun', type: 'university', city: 'Northridge' },
  { name: 'California State University, Sacramento', slug: 'sac-state', type: 'university', city: 'Sacramento' },
  { name: 'California State University, San Bernardino', slug: 'csusb', type: 'university', city: 'San Bernardino' },
  { name: 'California State University San Marcos', slug: 'csusm', type: 'university', city: 'San Marcos' },
  { name: 'Sonoma State University', slug: 'sonoma-state', type: 'university', city: 'Rohnert Park' },
  { name: 'California State University, Stanislaus', slug: 'stan-state', type: 'university', city: 'Turlock' },
  { name: 'Cal Maritime', slug: 'cal-maritime', type: 'university', city: 'Vallejo' },

  // ========== PRIVATE PRESTIGIOUS UNIVERSITIES ==========
  { name: 'Stanford University', slug: 'stanford', type: 'university', city: 'Stanford' },
  { name: 'California Institute of Technology', slug: 'caltech', type: 'university', city: 'Pasadena' },
  { name: 'University of Southern California', slug: 'usc', type: 'university', city: 'Los Angeles' },
  { name: 'Pepperdine University', slug: 'pepperdine', type: 'university', city: 'Malibu' },
  { name: 'Santa Clara University', slug: 'santa-clara', type: 'university', city: 'Santa Clara' },
  { name: 'Loyola Marymount University', slug: 'lmu', type: 'university', city: 'Los Angeles' },
  { name: 'University of San Diego', slug: 'san-diego', type: 'university', city: 'San Diego' },
  { name: 'Chapman University', slug: 'chapman', type: 'university', city: 'Orange' },

  // ========== THE CLAREMONT COLLEGES ==========
  { name: 'Pomona College', slug: 'pomona', type: 'university', city: 'Claremont' },
  { name: 'Claremont McKenna College', slug: 'claremont-mckenna', type: 'university', city: 'Claremont' },
  { name: 'Harvey Mudd College', slug: 'harvey-mudd', type: 'university', city: 'Claremont' },
  { name: 'Pitzer College', slug: 'pitzer', type: 'university', city: 'Claremont' },
  { name: 'Scripps College', slug: 'scripps', type: 'university', city: 'Claremont' },

  // ========== OTHER PRESTIGIOUS PRIVATE INSTITUTIONS ==========
  { name: 'Occidental College', slug: 'oxy', type: 'university', city: 'Los Angeles' },
  { name: 'University of San Francisco', slug: 'usfca', type: 'university', city: 'San Francisco' },
  { name: 'Mills College at Northeastern University', slug: 'mills', type: 'university', city: 'Oakland' },
  { name: 'National University', slug: 'national-university', type: 'university', city: 'La Jolla' },

  // ========== HIGH SCHOOLS ==========
  { name: 'Lincoln High School (SF)', slug: 'lincoln-high-sf', type: 'high_school', city: 'San Francisco' },
];

async function run() {
  await mongoose.connect(env.MONGODB_URI);

  // Since you deleted the collection, simplest is insertMany
  const docs = SEED.map((c) => ({
    ...c,
    state: c.state || 'CA',
    aliases: buildAliases(c),
  }));

  await campusModel.insertMany(docs, { ordered: true });

  const count = await campusModel.countDocuments();
  console.log(`✅ Seeded campuses (with aliases). Total: ${count}`);

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});