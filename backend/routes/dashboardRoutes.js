const express = require('express');
const { getSummary } = require('../controllers/dashboardController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.use(protect);

// Dashboard summary (Any authenticated user)
router.get('/summary', authorize('viewer', 'analyst', 'admin'), getSummary);

module.exports = router;
