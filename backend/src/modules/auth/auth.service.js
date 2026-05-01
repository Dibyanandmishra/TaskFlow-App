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

module.exports = { register, login, refreshAccessToken, getProfile };