const taskService = require('./task.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../utils/apiResponse');

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user._id);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Task created successfully',
    data: { task },
  });
});

const getTasks = catchAsync(async (req, res) => {
  const { tasks, meta } = await taskService.getTasks(req.query, req.user);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Tasks retrieved successfully',
    data: { tasks },
    meta,
  });
});

const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Task retrieved successfully',
    data: { task },
  });
});

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Task updated successfully',
    data: { task },
  });
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Task deleted successfully',
  });
});

const getTaskStats = catchAsync(async (req, res) => {
  const stats = await taskService.getTaskStats(req.user);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Task statistics retrieved successfully',
    data: { stats },
  });
});

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, getTaskStats };
