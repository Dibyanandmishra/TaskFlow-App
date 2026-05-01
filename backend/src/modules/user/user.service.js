const User = require('./user.model');
const AppError = require('../../utils/AppError');
const { parsePagination, buildPaginationMeta } = require('../../utils/paginate');

const listUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);

  const filter = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [users, totalDocs] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const meta = buildPaginationMeta(page, limit, totalDocs);

  return { users, meta };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

const updateUserRole = async (userId, role) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  user.role = role;
  await user.save();

  return user.toJSON();
};


const toggleUserStatus = async (userId, isActive) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  user.isActive = isActive;
  await user.save();

  return user.toJSON();
};

module.exports = { listUsers, getUserById, updateUserRole, toggleUserStatus };
