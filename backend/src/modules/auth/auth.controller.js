const authService = require('./auth.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../utils/apiResponse');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);

  sendSuccess(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: result,
  });
});


const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Login successful',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await authService.refreshAccessToken(req.body.refreshToken);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Token refreshed successfully',
    data: result,
  });
});


const getMe = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Profile retrieved successfully',
    data: { user },
  });
});

module.exports = { register, login, refreshToken, getMe };