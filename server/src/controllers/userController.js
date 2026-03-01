import createHttpError from 'http-errors';

import { comparePassword, generateToken, hashPassword } from '../middleware/authMiddleware.js';
import { userModel } from '../models/userModel.js';

export async function signup(req, res, next) {
  try {
    const {email, password, name} = req.body;
    console.log(email, password, name);
    const existingUser = await userModel.findOne({email});
    if (existingUser) return next(createHttpError(400, 'user already exists'));
      const user = await userModel.create({
        ...req.body,
        password: await hashPassword(req.body.password),
        role: 'user'
      })
      const token = await generateToken(user._id.toString());
    res.json({
      message: 'User created successfully',
      token,
      user: {id: user._id, email: user.email, name: user.name}
    })
  } catch (err) {
    res.json({err})
  }
}

export async function login(req, res, next) {
  try {
    console.log(req.body);
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if (!user) return next(createHttpError(404, 'User not found'));
    
    const ok = await comparePassword(password, user.password);
    if (!ok) return next(createHttpError(403, "Invalid email or password"));
    
    const token = await generateToken(user._id.toString());
    return res.json({
      message: "logged in successfully",
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } 
  catch (error) {
       return next(error);
  }
}
export async function logout(req, res) {
  res.json({ message: "logged out successfully" });
}