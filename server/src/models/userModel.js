import mongoose from 'mongoose';
const userSchema = mongoose.Schema(
    {
      name: {type: String, required: true},
      age: {type: Number, min: 12, required: true},
      email: {type: String, required: true},
      password: {type: String, required: true},
      avatar: String,
      role: {type: String, enum: ['user', 'admin'], default: 'user'}
    },
    {timestamps: true});
export const userModel = mongoose.model('User', userSchema);
