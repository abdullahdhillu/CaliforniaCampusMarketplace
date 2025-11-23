import {Router} from 'express';
import z from 'zod';

import {createProduct, getProducts} from '../controllers/productControllers.js'
import {zValidate} from '../validators/zValidate.js';

export const product = Router({mergeParams: true});
const productSchemaEnforcer = z.object({
  name: z.string(),
  description: z.string().max(2000).optional().default(''),
  price: z.number().min(0),
  category: z.string().optional().default('other'),
  images: z.array(z.string().url()).max(5).optional().default([]),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor'])
                 .optional()
                 .default('good'),
  sellerId: z.string().min(1).optional(),  // temporary until auth is added
  status: z.enum(['Active', 'Reserved', 'Sold', 'Removed']).default('Active')
})
product.get('/', getProducts);
product.post('/createProduct', zValidate(productSchemaEnforcer), createProduct);
