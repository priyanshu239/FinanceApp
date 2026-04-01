const Record = require('../models/Record');
const { validationResult } = require('express-validator');

// @desc    Get all records
// @route   GET /api/records
// @access  Private (Analyst, Admin)
exports.getRecords = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // If category provided, use regex for partial match
    if (reqQuery.category) {
      reqQuery.category = { $regex: reqQuery.category, $options: 'i' };
    }

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = Record.find(JSON.parse(queryStr)).populate({
      path: 'createdBy',
      select: 'name email role',
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Record.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const records = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      pagination,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private (Analyst, Admin)
exports.getRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id).populate({
      path: 'createdBy',
      select: 'name email role',
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new record
// @route   POST /api/records
// @access  Private (Admin only)
exports.createRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const record = await Record.create(req.body);

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private (Admin only)
exports.updateRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Private (Admin only)
exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    await Record.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete multiple records
// @route   POST /api/records/bulk-delete
// @access  Private (Admin only)
exports.deleteRecords = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of record IDs',
      });
    }

    await Record.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} records deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};
