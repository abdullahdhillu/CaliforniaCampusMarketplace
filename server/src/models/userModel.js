import mongoose from 'mongoose';
const userSchema = mongoose.Schema(
    {name: String, age: {type: Number, min: 14}, email: String, avatar: String},
    {timestamps: true});
export const userModel = mongoose.model('User', userSchema);
