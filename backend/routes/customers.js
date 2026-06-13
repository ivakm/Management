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

// Get all customers
router.get('/', authenticateToken, (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;

  let customers = [...mockData.customers];

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    customers = customers.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.company.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (status && status !== 'all') {
    customers = customers.filter(c => c.status === status);
  }

  // Calculate pagination
  const total = customers.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedCustomers = customers.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedCustomers,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Get single customer by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const customer = mockData.customers.find(c => c.id === parseInt(id));

  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  res.json({ success: true, data: customer });
});

// Create new customer
router.post('/', authenticateToken, (req, res) => {
  const { name, email, phone, company, status = 'pending' } = req.body;

  // Check if email already exists
  const existingCustomer = mockData.customers.find(c => c.email === email);
  if (existingCustomer) {
    return res.status(400).json({ success: false, message: 'Customer with this email already exists' });
  }

  const newCustomer = {
    id: mockData.customers.length + 1,
    name,
    email,
    phone,
    company,
    status,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
    joinDate: new Date().toISOString().split('T')[0],
    lastActivity: new Date().toISOString(),
    totalSpent: 0
  };

  mockData.customers.push(newCustomer);

  res.status(201).json({ success: true, data: newCustomer });
});

// Update customer
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, status } = req.body;

  const customerIndex = mockData.customers.findIndex(c => c.id === parseInt(id));

  if (customerIndex === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const customer = mockData.customers[customerIndex];

  // Update fields
  if (name) customer.name = name;
  if (email) customer.email = email;
  if (phone) customer.phone = phone;
  if (company) customer.company = company;
  if (status) customer.status = status;

  customer.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=667eea&color=fff`;

  mockData.customers[customerIndex] = customer;

  res.json({ success: true, data: customer });
});

// Delete customer
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const customerIndex = mockData.customers.findIndex(c => c.id === parseInt(id));

  if (customerIndex === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  mockData.customers.splice(customerIndex, 1);

  res.json({ success: true, message: 'Customer deleted successfully' });
});

module.exports = router;