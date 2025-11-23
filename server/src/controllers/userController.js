import {Router} from 'express';
import createHttpError from 'http-errors';

import {generateToken, hashPassword} from '../middleware/authMiddleware.js';
import {userModel} from '../models/userModel.js';

export async function signup(req, res, next) {
  try {
    const {email, password} = req.body;
    const existingUser = await userModel.findOne({email});
    if (existingUser) return next(createHttpError(400), 'user already exists')
      const user = await userModel.create(
          {...req.body, password: await hashPassword(req.body.password)})
      const token = await generateToken(user._id);
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
  const {email, password} = req.body;
  const user = await userModel.findOne({email});
  if (!user) return next(createHttpError(404, 'user not found'));
  res.json({message: 'logged in successfully', user})
}