const Joi = require('joi');

const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  role: Joi.string().valid('user', 'admin'),
  search: Joi.string().trim().max(200),
});

const userIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required',
    }),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required().messages({
    'any.only': 'Role must be either user or admin',
    'any.required': 'Role is required',
  }),
});

const toggleStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    'any.required': 'isActive is required',
  }),
});

module.exports = { userQuerySchema, userIdParamSchema, updateRoleSchema, toggleStatusSchema };
