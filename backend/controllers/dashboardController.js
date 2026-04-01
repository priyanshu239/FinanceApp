const Record = require('../models/Record');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private (Viewer, Analyst, Admin)
exports.getSummary = async (req, res, next) => {
  try {
    const aggregate = await Record.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalIncome: {
                  $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
                },
                totalExpense: {
                  $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                netBalance: { $subtract: ['$totalIncome', '$totalExpense'] },
              },
            },
          ],
          categoryTotals: [
            {
              $group: {
                _id: { type: '$type', category: '$category' },
                total: { $sum: '$amount' },
              },
            },
            {
              $sort: { total: -1 },
            },
            {
              $project: {
                _id: 0,
                type: '$_id.type',
                category: '$_id.category',
                total: 1,
              },
            },
          ],
          monthlyTrends: [
            {
              $group: {
                _id: {
                  year: { $year: '$date' },
                  month: { $month: '$date' },
                },
                income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
              },
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 },
            },
            {
              $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                income: 1,
                expense: 1,
                net: { $subtract: ['$income', '$expense'] },
              },
            },
          ],
          weeklyTrends: [
            {
              $group: {
                _id: {
                  year: { $year: '$date' },
                  week: { $week: '$date' },
                },
                income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
              },
            },
            {
              $sort: { '_id.year': 1, '_id.week': 1 },
            },
            {
              $project: {
                _id: 0,
                year: '$_id.year',
                week: '$_id.week',
                income: 1,
                expense: 1,
                net: { $subtract: ['$income', '$expense'] },
              },
            },
          ],
        },
      },
    ]);

    const result = aggregate[0];

    // Get recent activities (last 5 records)
    const recentActivities = await Record.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    // Format totals
    const totals = result.totals[0] || {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totals,
        categoryTotals: result.categoryTotals,
        monthlyTrends: result.monthlyTrends,
        weeklyTrends: result.weeklyTrends,
        recentActivities,
      },
    });
  } catch (err) {
    next(err);
  }
};
