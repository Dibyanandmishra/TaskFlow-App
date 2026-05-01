const userService = require('./user.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../utils/apiResponse');

const listUsers = catchAsync(async (req, res) => {
  const { users, meta } = await userService.listUsers(req.query);

  sendSuccess(res, {
    statusCode: 200,
    message: 'Users retrieved successfully',
    data: { users },
    meta,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  sendSuccess(res, {
    statusCode: 200,
    message: 'User retrieved successfully',
    data: { user },
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);

  sendSuccess(res, {
    statusCode: 200,
    message: 'User role updated successfully',
    data: { user },
  });
});

const toggleUserStatus = catchAsync(async (req, res) => {
  const user = await userService.toggleUserStatus(req.params.id, req.body.isActive);

  sendSuccess(res, {
    statusCode: 200,
    message: `User ${req.body.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { user },
  });
});

module.exports = { listUsers, getUser, updateUserRole, toggleUserStatus };
