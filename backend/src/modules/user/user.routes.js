const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { userQuerySchema, userIdParamSchema, updateRoleSchema, toggleStatusSchema } = require('./user.validation');

router.get('/', authenticate, authorize('admin'), validate(userQuerySchema, 'query'), userController.listUsers);

router
  .route('/:id')
  .all(authenticate, authorize('admin'), validate(userIdParamSchema, 'params'))
  .get(userController.getUser);

router.patch('/:id/role', authenticate, authorize('admin'), validate(userIdParamSchema, 'params'), validate(updateRoleSchema), userController.updateUserRole);
router.patch('/:id/status', authenticate, authorize('admin'), validate(userIdParamSchema, 'params'), validate(toggleStatusSchema), userController.toggleUserStatus);

module.exports = router;
