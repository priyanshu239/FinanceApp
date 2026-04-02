const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols'
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    }),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// Get current user profile
router.get('/me', protect, getMe);

// Update user profile (name & password only)
router.put(
  '/profile',
  protect,
  [
    check('name', 'Name cannot be empty').optional().not().isEmpty(),
    check(
      'newPassword',
      'New password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols'
    )
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      }),
  ],
  updateProfile
);

module.exports = router;
