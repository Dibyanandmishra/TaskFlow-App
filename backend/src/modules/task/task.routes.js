const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createTaskSchema, updateTaskSchema, taskQuerySchema, taskIdParamSchema } = require('./task.validation');

router.use(authenticate);
router.get('/stats', taskController.getTaskStats);

router
  .route('/')
  .get(validate(taskQuerySchema, 'query'), taskController.getTasks)
  .post(validate(createTaskSchema), taskController.createTask);

router
  .route('/:id')
  .all(validate(taskIdParamSchema, 'params'))
  .get(taskController.getTask)
  .patch(validate(updateTaskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
