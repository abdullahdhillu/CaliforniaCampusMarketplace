import {Router} from 'express';
import z from 'zod';

import {login, signup} from '../controllers/userController.js';
import {authenticate} from '../middleware/authMiddleware.js';
import {zValidate} from '../validators/zValidate.js';

const userSchemaEnforcer = z.object({
  email: z.string(),
  password: z.string(),
  age: z.number().min(12),
  name: z.string(),
  avatar: z.string().optional()
})
export const user = Router();

user.post('/signup', zValidate(userSchemaEnforcer), signup);
user.post('/login', login);