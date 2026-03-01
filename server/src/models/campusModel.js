import mongoose from 'mongoose';

const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["university", "community_college", "high_school"],
    },
    city: { type: String, required: true },
    state: { type: String, default: "CA" },
    aliases: { type: [String], default: [] },
  },
  { timestamps: true }
);

// ✅ keep aliases index
campusSchema.index({ aliases: 1 });

export const campusModel = mongoose.model("Campus", campusSchema);