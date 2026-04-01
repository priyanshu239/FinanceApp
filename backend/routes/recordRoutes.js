const express = require('express');
const {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  deleteRecords,
} = require('../controllers/recordController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { check } = require('express-validator');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Get all records (Analyst or Admin)
router.get('/', authorize('analyst', 'admin'), getRecords);

// Get single record (Analyst or Admin)
router.get('/:id', authorize('analyst', 'admin'), getRecord);

// Bulk delete records (Admin only)
router.post('/bulk-delete', authorize('admin'), deleteRecords);

// Create new record (Admin only)
router.post(
  '/',
  authorize('admin'),
  [
    check('amount', 'Please add a numeric amount').isNumeric(),
    check('amount', 'Amount must be positive').custom((value) => value > 0),
    check('type', 'Type must be income or expense').isIn(['income', 'expense']),
    check('category', 'Category is required').not().isEmpty(),
  ],
  createRecord
);

// Update record (Admin only)
router.put(
  '/:id',
  authorize('admin'),
  [
    check('amount', 'If provided, amount must be numeric').optional().isNumeric(),
    check('amount', 'Amount must be positive').optional().custom((value) => value > 0),
    check('type', 'If provided, type must be income or expense').optional().isIn(['income', 'expense']),
  ],
  updateRecord
);

// Delete record (Admin only)
router.delete('/:id', authorize('admin'), deleteRecord);

module.exports = router;
