import {campusModel} from '../models/CampusModel.js';
export async function listCampuses(req, res, next) {
  try {
    const items = (await campusModel.find().sort({name: 1}).lean());
    res.json({items})
  } catch (error) {
    next(error);
  }
}

export async function getCampusBySlug(req, res, next) {
  try {
    const slug = req.params.slug;
    console.log(slug);
    const campus = await campusModel.findOne({slug}).lean();
    if (!campus) res.status(404).json({error: 'campus not found'});
    console.log('Campus Fetched');
    res.json(campus);
  } catch (error) {
    next(error);
  }
}