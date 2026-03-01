import { Router } from 'express';
import z from 'zod';

import { createProduct, deleteProduct, getAllProducts, getProduct, getProductNoSlug } from '../controllers/productControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';

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
  status: z.enum(['active', 'reserved', 'sold', 'removed']).default('Active')
})
product.get('/search', getProductNoSlug);
product.get('/', getAllProducts);
product.get('/:id', getProduct);
product.post(
    '/', authenticate,
    createProduct);
product.delete('/:id', authenticate, deleteProduct);