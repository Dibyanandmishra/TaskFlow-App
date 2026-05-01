const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { userQuerySchema, userIdParamSchema, updateRoleSchema, toggleStatusSchema } = require('./user.validation');

router.use(authenticate, authorize('admin'));

router.get('/', validate(userQuerySchema, 'query'), userController.listUsers);

router
  .route('/:id')
  .all(validate(userIdParamSchema, 'params'))
  .get(userController.getUser);

router.patch('/:id/role', validate(userIdParamSchema, 'params'), validate(updateRoleSchema), userController.updateUserRole);
router.patch('/:id/status', validate(userIdParamSchema, 'params'), validate(toggleStatusSchema), userController.toggleUserStatus);

module.exports = router;
