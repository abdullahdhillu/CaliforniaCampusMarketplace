import createHttpError from 'http-errors';
import z from 'zod';

import {campusModel} from '../models/CampusModel.js';
import {productModel} from '../models/productModel.js';


export async function getProducts(req, res, next) {
  const slug = req.params.slug;
  const {q, category, min, max, page = 1, limit = 20} = req.query;
  const campus = await campusModel.findOne({slug});
  if (!campus) return next(createHttpError(404, 'campus not found'));
  const filter = {campusID: campus._id, status: 'Active'};
  if (q) {
    filter.$text = {$search: q};
    const items =
        await productModel.find(filter).sort({score: {$meta: 'textScore'}});
    res.json({products: items.length, items})
  }
  if (category) filter.category = category;
  if (min || max) {
    filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);
  }
  const items = await productModel.find(filter)
                    .sort({createdAt: -1})
                    .skip((Number(page) - 1) * Number(limit))
                    .limit(Number(limit))
                    .lean();
  console.log('Fetched Products');
  res.json({items, page: Number(page), hasMore: items.length === Number(limit)})
}

export async function createProduct(req, res, next) {
  const {slug} = req.params;
  const campus = await campusModel.findOne({slug}).lean();
  if (!campus) return next(createHttpError(404, 'campus not found'));
  const doc = await productModel.create({...req.body, campusID: campus._id});
  res.json({message: 'Product uploaded successfully', doc})
}