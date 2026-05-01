const Task = require('./task.model');
const AppError = require('../../utils/AppError');
const { parsePagination, buildPaginationMeta } = require('../../utils/paginate');
const createTask = async (data, userId) => {
  const task = await Task.create({
    ...data,
    createdBy: userId,
  });

  return task.toJSON();
};
const getTasks = async (query, user) => {
  const { page, limit, skip } = parsePagination(query);

  const filter = {};
  if (user.role !== 'admin') {
    filter.createdBy = user._id;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sortField = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  const [tasks, totalDocs] = await Promise.all([
    Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean(),
    Task.countDocuments(filter),
  ]);

  const meta = buildPaginationMeta(page, limit, totalDocs);

  return { tasks, meta };
};


const getTaskById = async (taskId, user) => {
  const task = await Task.findById(taskId)
    .populate('createdBy', 'name email')
    .lean();

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role !== 'admin' && task.createdBy._id.toString() !== user._id.toString()) {
    throw new AppError('You do not have permission to access this task.', 403);
  }

  return task;
};

const updateTask = async (taskId, updateData, user) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role !== 'admin' && task.createdBy.toString() !== user._id.toString()) {
    throw new AppError('You do not have permission to update this task.', 403);
  }

  Object.assign(task, updateData);
  await task.save();

  const updated = await Task.findById(task._id)
    .populate('createdBy', 'name email')
    .lean();

  return updated;
};


const deleteTask = async (taskId, user) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role !== 'admin' && task.createdBy.toString() !== user._id.toString()) {
    throw new AppError('You do not have permission to delete this task.', 403);
  }

  await Task.findByIdAndDelete(taskId);
};

const getTaskStats = async (user) => {
  const matchStage = user.role === 'admin' ? {} : { createdBy: user._id };

  const stats = await Task.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        in_progress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  return stats[0] || { total: 0, pending: 0, in_progress: 0, completed: 0 };
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskStats };
