import {ZodError} from 'zod';

export const zValidate = (schema, where = 'body') => (req, res, next) => {
  try {
    req[where] = schema.parse(req[where]);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json(
          {error: 'validation_error', issues: err.issues});
    }
    next(err);
  }
};