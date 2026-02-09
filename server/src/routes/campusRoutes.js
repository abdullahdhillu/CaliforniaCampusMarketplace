import { Router } from 'express';

import { getCampusBySlug, listCampuses } from '../controllers/campusControllers.js';


export const campus = Router();
campus.get('/', listCampuses);
campus.get('/:slug', getCampusBySlug);
