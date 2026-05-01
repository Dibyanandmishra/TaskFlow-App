const Joi = require('joi');

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed 150 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().max(2000).allow('').default('').messages({
    'string.max': 'Description cannot exceed 2000 characters',
  }),
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .default('pending')
    .messages({
      'any.only': `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    }),
  priority: Joi.string()
    .valid(...VALID_PRIORITIES)
    .default('medium')
    .messages({
      'any.only': `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    }),
  dueDate: Joi.date().iso().min('now').allow(null).default(null).messages({
    'date.min': 'Due date cannot be in the past',
    'date.format': 'Due date must be a valid ISO date',
  }),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed 150 characters',
  }),
  description: Joi.string().trim().max(2000).allow('').messages({
    'string.max': 'Description cannot exceed 2000 characters',
  }),
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .messages({
      'any.only': `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    }),
  priority: Joi.string()
    .valid(...VALID_PRIORITIES)
    .messages({
      'any.only': `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    }),
  dueDate: Joi.date().iso().allow(null).messages({
    'date.format': 'Due date must be a valid ISO date',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

const taskQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid(...VALID_STATUSES),
  priority: Joi.string().valid(...VALID_PRIORITIES),
  search: Joi.string().trim().max(200),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title', 'status', 'priority', 'dueDate').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const taskIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid task ID format',
      'any.required': 'Task ID is required',
    }),
});

module.exports = { createTaskSchema, updateTaskSchema, taskQuerySchema, taskIdParamSchema };
