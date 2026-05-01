const AppError = require('../utils/AppError');


const validate = (schema, property = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      errors: { wrap: { label: false } },
    });

    if (error) {
      const err = new AppError('Validation failed', 422, 'VALIDATION_ERROR');
      err.details = error.details;
      // Attach Joi flag for error handler
      err.isJoi = true;
      return next(err);
    }

    // Replace with sanitized values
    req[property] = value;
    next();
  };
};

module.exports = validate;
