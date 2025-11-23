import mongoose from 'mongoose';
const campusSchema = new mongoose.Schema(
    {
      name: {type: String, required: true},
      slug: {type: String, required: true, unique: true, index: true},
      type: {type: String, required: true, enum: ['university, high_school']},
      city: {type: String, required: true},
      state: {type: String, default: 'CA'},
    },
    {timestamps: true})

export const campusModel = mongoose.model('Campus', campusSchema);