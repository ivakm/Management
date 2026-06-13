const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mockData = require('../data/mockData');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get dashboard statistics
router.get('/stats', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      totalRevenue: mockData.dashboardStats.totalRevenue,
      newCustomers: mockData.dashboardStats.newCustomers,
      activeUsers: mockData.dashboardStats.activeUsers,
      conversionRate: mockData.dashboardStats.conversionRate
    }
  });
});

// Get monthly revenue data
router.get('/revenue', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: mockData.dashboardStats.monthlyRevenue
  });
});

// Get customer distribution
router.get('/distribution', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: mockData.dashboardStats.customerDistribution
  });
});

// Get recent activity
router.get('/activity', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: mockData.dashboardStats.recentActivity
  });
});

// Get top customers
router.get('/top-customers', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: mockData.dashboardStats.topCustomers
  });
});

// Get all dashboard data
router.get('/', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: mockData.dashboardStats
  });
});

module.exports = router;