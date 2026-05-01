const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../modules/user/user.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const authenticate = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Please provide a valid token.', 401);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new AppError('Invalid or expired token.', 401);
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new AppError('The user associated with this token no longer exists.', 401);
  }

  req.user = user;
  next();
});


const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required before authorization.', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action.', 403);
    }

    next();
  };
};

module.exports = { authenticate, authorize };
