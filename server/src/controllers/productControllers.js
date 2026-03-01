import createHttpError from 'http-errors';

import { detectCampusIdFromQuery } from '../../utils/detectCampus.js';
import { campusModel } from '../models/CampusModel.js';
import { productModel } from '../models/productModel.js';
import { userModel } from '../models/userModel.js';


export async function getProductNoSlug(req, res, next) {
  try {
    // 1) Read query params
    let q = String(req.query.q || "").trim();
    const campusSlug = String(req.query.campus || "").trim(); // from dropdown
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;
    const minRaw = req.query.min;
    const maxRaw = req.query.max;
    const category = req.query.category;
    // 2) Decide campusId (explicit campus param wins)
    let campusID = null;

    if (campusSlug) {
      const campus = await campusModel.findOne({ slug: campusSlug }).select("_id").lean();
      if (campus) campusID = campus._id;
    } else {
      const detected = await detectCampusIdFromQuery(q); // your alias detector
      campusID = detected.campusID;
      q = detected.q; // remainder after removing campus words
    }

    // 3) Build Mongo filter using campusId, category/min/max, etc.
    const filter = {};
    if (campusID) filter.campusID = campusID;
    if (category && category !== 'All') {
      filter.category = category;
    }
    let price = {}
    if (minRaw !== undefined && minRaw !== "") {
      const minVal = Number(minRaw);
      if (!Number.isNaN(minVal)) price.$gte = minVal;
    }
    if (maxRaw !== undefined && maxRaw !== "") {
      const maxVal = Number(maxRaw);
      if (!Number.isNaN(maxVal)) price.$lte = maxVal;
    }

    if(Object.keys(price).length) filter.price = price;
    // 4) Apply text search (since you have text index)
    const projection = {};
    let sort = { createdAt: -1 };

    if (q) {
      filter.$text = { $search: q };
      projection.score = { $meta: "textScore" };
      sort = { score: { $meta: "textScore" }, createdAt: -1 };
    }
    // 5) Query products (+ populate campusId for frontend links)
    const items = await productModel
      .find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("campusID", "slug")
      .lean();

    res.json({ items, page, hasMore: items.length === limit });
  } catch (err) {
    next(err);
  }
}
export async function getProduct(req, res, next) {
  const id = req.params.id;
  const slug = req.params.slug;
  const campus = await campusModel.findOne({ slug });
  if (!campus) return next(createHttpError(404, "no such campus found"));
  const filter = { campusID: campus._id, status: 'active', _id: id };
  const item = await productModel.findOne(filter);
  if (!item || item.length == 0) return next(createHttpError(404, "no such product found"));
  return res.json({ product: item })
}

export async function getAllProducts(req, res, next) {
  const slug = req.params.slug;
  const { q, category, min, max, page = 1, limit = 20 } = req.query;
  const campus = await campusModel.findOne({ slug });
  if (!campus) return next(createHttpError(404, 'campus not found'));
  const filter = { campusID: campus._id, status: 'active' };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (min || max) {
    filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);
  }
  const sort = q ? { score: { $meta: 'textScore' } } : { createdAt: -1 }
  const items = await productModel.find(filter)
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();
  console.log('Fetched Products');
  return res.json({ items, page: Number(page), hasMore: items.length === Number(limit) })
}

export async function createProduct(req, res, next) {
  const { slug } = req.params;
  const user = await userModel.findById(req.user.userId);
  const campus = await campusModel.findOne({ slug }).lean();
  console.log(user, campus);
  if (!campus) return next(createHttpError(404, 'campus not found'));
  const doc = await productModel.create(
    { ...req.body, campusID: campus._id, sellerID: req.user.userId, sellerName: user.name });
  res.json({ message: 'Product uploaded successfully', doc })
}

export async function deleteProduct(req, res, next) {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) return next(createHttpError(404, 'product not found'));
  if (product.sellerID.toString() != req.user.userId)
    return next(createHttpError(403, 'Not authorized - you are not the owner'));
  await productModel.findByIdAndDelete(id);
  res.json({ message: 'Product deleted successfully', product })
}
