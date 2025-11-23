import {Router} from 'express';
import z from 'zod';

import {createProduct, deleteProduct, getProducts} from '../controllers/productControllers.js'
import {authenticate, requireOwner} from '../middleware/authMiddleware.js';
import {zValidate} from '../validators/zValidate.js';

export const product = Router({mergeParams: true});
const productSchemaEnforcer = z.object({
  title: z.string(),
  description: z.string().max(2000).optional().default(''),
  price: z.number().min(0),
  category: z.string().optional().default('other'),
  images: z.array(z.string().url()).max(5).optional().default([]),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor'])
                 .optional()
                 .default('good'),
  status: z.enum(['Active', 'Reserved', 'Sold', 'Removed']).default('Active')
})
product.get('/', getProducts);
product.post(
    '/createProduct', zValidate(productSchemaEnforcer), authenticate,
    createProduct);
product.delete('/deleteProduct/:id', authenticate, deleteProduct);