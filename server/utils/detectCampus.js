import { campusModel } from "../src/models/CampusModel.js";


const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Returns:
 *  - campusID: ObjectId | null
 *  - q: remaining search text after removing campus words
 */
export async function detectCampusIdFromQuery(raw) {
  const text = normalize(raw);
  if (!text) return { campusID: null, q: "" };

  // For ~70 campuses, loading all is fine (and simplest).
  const campuses = await campusModel.find({}, { aliases: 1 }).lean();

  // Build alias list longest-first so "san jose state" beats "san jose"
  const aliasPairs = [];
  for (const c of campuses) {
    for (const a of c.aliases || []) {
      const alias = normalize(a);
      if (alias) aliasPairs.push({ campusID: c._id, alias });
    }
  }
  aliasPairs.sort((a, b) => b.alias.length - a.alias.length);

  for (const { campusID, alias } of aliasPairs) {
    const re = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i");
    if (re.test(text)) {
      const remainder = text.replace(re, " ").replace(/\s+/g, " ").trim();
      return { campusID, q: remainder };
    }
  }

  return { campusID: null, q: text };
}