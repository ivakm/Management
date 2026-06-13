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

router.get('/', authenticateToken, async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length} OR company ILIKE $${params.length})`);
  }

  if (status && status !== 'all') {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countResult = await pool.query(`SELECT COUNT(*) FROM customers ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, (page - 1) * limit);
    const dataResult = await pool.query(
      `SELECT * FROM customers ${where} ORDER BY join_date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, email, phone, company, status = 'pending' } = req.body;
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`;

  try {
    const result = await pool.query(
      'INSERT INTO customers (name, email, phone, company, status, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, company, status, avatar]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'Customer with this email already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, company, status } = req.body;
  const id = req.params.id;

  try {
    const existing = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const current = existing.rows[0];
    const updatedName = name || current.name;
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedName)}&background=667eea&color=fff`;

    const result = await pool.query(
      `UPDATE customers SET name = $1, email = $2, phone = $3, company = $4, status = $5, avatar = $6, last_activity = NOW()
       WHERE id = $7 RETURNING *`,
      [updatedName, email || current.email, phone || current.phone, company || current.company, status || current.status, avatar, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
