const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deactivateAccount
} = require('../controllers/authController');

const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateChangePassword
} = require('../middleware/validation');

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);

// Protected routes
router.use(auth); // Apply auth middleware to all routes below

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', validateChangePassword, changePassword);
router.put('/deactivate', deactivateAccount);

module.exports = router;