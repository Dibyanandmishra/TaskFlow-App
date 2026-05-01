const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const config = require('../../config');
const AppError = require('../../utils/AppError');
const { generateTokenPair } = require('../../utils/generateToken');

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
  }

  const user = await User.create({ name, email, password });
  const tokens = generateTokenPair(user);

  return {
    user: user.toJSON(),
    tokens,
  };
};


const login = async ({ email, password }) => {
  const user = await User.findOne({ email, isActive: true }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const tokens = generateTokenPair(user);

  return {
    user: user.toJSON(),
    tokens,
  };
};
const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.secret);
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401, 'INVALID_REFRESH_TOKEN');
  }

  if (decoded.type !== 'refresh') {
    throw new AppError('Invalid token type.', 401, 'INVALID_TOKEN_TYPE');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new AppError('User not found or deactivated.', 401);
  }

  const tokens = generateTokenPair(user);

  return { tokens };
};
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user.toJSON();
};

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  if (data.name) user.name = data.name;
  if (data.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: userId } });
    if (existing) throw new AppError('Email already in use.', 409);
    user.email = data.email;
  }

  await user.save();
  return user.toJSON();
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found.', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Incorrect current password.', 401);

  user.password = newPassword;
  await user.save();
};

module.exports = { register, login, refreshAccessToken, getProfile, updateProfile, changePassword };