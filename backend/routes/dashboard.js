const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(total_spent), 0) AS "totalRevenue",
        COUNT(*) FILTER (WHERE join_date >= NOW() - INTERVAL '30 days') AS "newCustomers",
        COUNT(*) FILTER (WHERE status = 'active') AS "activeUsers",
        ROUND(COUNT(*) FILTER (WHERE status = 'active')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS "conversionRate"
      FROM customers
    `);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/revenue', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT TO_CHAR(DATE_TRUNC('month', join_date), 'Mon') AS month,
             COALESCE(SUM(total_spent), 0) AS revenue
      FROM customers
      WHERE join_date >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', join_date)
      ORDER BY DATE_TRUNC('month', join_date)
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/distribution', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT status, COUNT(*) AS count FROM customers GROUP BY status');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/top-customers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY total_spent DESC LIMIT 5');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [stats, revenue, distribution, activity, topCustomers] = await Promise.all([
      pool.query(`
        SELECT
          COALESCE(SUM(total_spent), 0) AS "totalRevenue",
          COUNT(*) FILTER (WHERE join_date >= NOW() - INTERVAL '30 days') AS "newCustomers",
          COUNT(*) FILTER (WHERE status = 'active') AS "activeUsers",
          ROUND(COUNT(*) FILTER (WHERE status = 'active')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS "conversionRate"
        FROM customers
      `),
      pool.query(`
        SELECT TO_CHAR(DATE_TRUNC('month', join_date), 'Mon') AS month,
               COALESCE(SUM(total_spent), 0) AS revenue
        FROM customers
        WHERE join_date >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', join_date)
        ORDER BY DATE_TRUNC('month', join_date)
      `),
      pool.query('SELECT status, COUNT(*) AS count FROM customers GROUP BY status'),
      pool.query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10'),
      pool.query('SELECT * FROM customers ORDER BY total_spent DESC LIMIT 5'),
    ]);

    res.json({
      success: true,
      data: {
        ...stats.rows[0],
        monthlyRevenue: revenue.rows,
        customerDistribution: distribution.rows,
        recentActivity: activity.rows,
        topCustomers: topCustomers.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
