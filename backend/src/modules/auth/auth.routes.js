const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema, refreshTokenSchema } = require('./auth.validation');
const { authLimiter } = require('../../middleware/rateLimiter');

// Public routes
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getMe);

module.exports = router;