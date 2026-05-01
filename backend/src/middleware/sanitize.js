const PROHIBITED_PATTERNS = /^\$|\./ ;

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (PROHIBITED_PATTERNS.test(key)) {
      continue; // Strip dangerous keys
    }
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

const mongoSanitize = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.params && Object.keys(req.params).length > 0) {
    const sanitizedParams = sanitizeObject(req.params);
    try {
      Object.assign(req.params, sanitizedParams);
    } catch {
      // If params are read-only, the Joi param validation handles safety
    }
  }

  next();
};

module.exports = mongoSanitize;
