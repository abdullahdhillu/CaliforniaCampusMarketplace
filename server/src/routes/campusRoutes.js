import {Router} from 'express';

import {getCampusBySlug, listCampuses} from '../controllers/campusControllers.js';
import {campusModel} from '../models/CampusModel.js';

import {product} from './productRoutes.js';

export const campus = Router();
campus.get('/', listCampuses);
campus.get('/:slug', getCampusBySlug);
