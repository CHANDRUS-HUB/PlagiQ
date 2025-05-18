const { User, PlagiarismHistory, UserLog } = require('../models');
const { Op } = require("sequelize");

const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalChecks = await PlagiarismHistory.count({ where: { userId } });

    const allHistory = await PlagiarismHistory.findAll({ where: { userId } });
console.log("stas fetching");

    const averageMatch =
      allHistory.length > 0
        ? (
          allHistory.reduce((sum, h) => sum + h.plagiarismPercentage, 0) /
          allHistory.length
        ).toFixed(2)
        : "0.00";


    res.json({
      totalChecks,
      totalFiles: allHistory.length,
      averageMatch,
      recentChecks: allHistory
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
    });
  } catch (err) {
    console.error("Error in user dashboard stats:", err);
    res.status(500).json({ error: "Failed to fetch user dashboard stats" });
  }
};




const getAdminDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const logs = await UserLog.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user', // Ensure this matches your association
          attributes: ['username', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      raw: true,
      nest: true,
    });

    // ✅ FIXED AGGREGATION
    const statsMap = {};
    logs.forEach((log) => {
      const userId = log.userId;
      const userName = log.user?.username || 'Unknown';
      const userEmail = log.user?.email || 'Unknown';

      if (!statsMap[userId]) {
        statsMap[userId] = {
          userName,
          email: userEmail,
          logins: 0,
          fileChecks: 0,
        };
      }

      if (log.action === 'login') statsMap[userId].logins++;
      if (log.action === 'file_check') statsMap[userId].fileChecks++;
    });

    // 4) Filter out Admin user
    const userStats = Object.values(statsMap).filter(
      (user) => user.email !== 'chandrumani72@gmail.com' // <-- change if needed
    );
    return res.json({ userStats });
  } catch (err) {
    console.error('Error in getAdminDashboardStats:', err);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};




const plagiarismResultHistory = async (req, res) => {
  try {
    const { fileName, plagiarismPercentage, userId, timestamp } = req.body;

    if (!fileName || !plagiarismPercentage || !userId || !timestamp) {
      return res.status(400).json({ errorMessage: 'Missing required fields' });
    }

    const newPlagiarismResult = await PlagiarismHistory.create({
      fileName,
      plagiarismPercentage,
      userId,
      createdAt: timestamp,
    });

    res.status(201).json({
      message: 'Plagiarism result saved successfully',
      plagiarismResult: newPlagiarismResult,
    });
  } catch (error) {
    console.error('Error saving plagiarism result:', error);
    res.status(500).json({ errorMessage: 'Error saving plagiarism result' });
  }
};

module.exports = { getAdminDashboardStats, getUserDashboardStats, plagiarismResultHistory };
