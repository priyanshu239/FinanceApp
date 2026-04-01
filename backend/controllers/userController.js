const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user (status/role)
// @route   PUT /api/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    // Safety check: Cannot demote the ONLY admin
    if (role && role !== 'admin') {
      const userToUpdate = await User.findById(req.params.id);
      if (userToUpdate && userToUpdate.role === 'admin') {
        const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: req.params.id } });
        if (otherAdmins === 0) {
          return res.status(400).json({
            success: false,
            message: 'Cannot demote the only administrator.'
          });
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Safety check: Cannot delete the ONLY admin
    if (user.role === 'admin') {
      const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: req.params.id } });
      if (otherAdmins === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only administrator.'
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
