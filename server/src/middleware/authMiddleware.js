import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { userModel } from '../models/userModel.js';

const JWT_SECRET_KEY = env.JWT_SECRET_KEY;
export async function generateToken(userId) {
  return jwt.sign({userId}, JWT_SECRET_KEY, {expiresIn: '7d'})
}
export async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No Authorization header found');
    return next(createHttpError(404, 'no token found. please log in'));
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token part found in Authorization header');
    return next(createHttpError(404, 'no token found. please log in'));
  }
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(
          createHttpError(403, 'Invalid or expired token, please try again'));
    }
    req.user = user;
    next();
  })
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

export async function requireOwner(req, res, next) {
  const {userId} = req.user;
  console.log(userId);
  const currentlyLoggedInUser =
      await userModel.findOne({_id: userId.toString()});
  console.log('current user:', currentlyLoggedInUser);
  if (currentlyLoggedInUser.role != 'admin') {
    return next(createHttpError(403, 'admin approval required'))
  }
  next();
}