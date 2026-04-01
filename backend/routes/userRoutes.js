const express = require('express');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// Apply global protection and admin authorization to all user management routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
