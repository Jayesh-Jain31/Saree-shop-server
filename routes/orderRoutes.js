const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Place order
router.post('/', protect, async (req, res) => {
  const order = await Order.create({ ...req.body, user: req.user.id });
  res.json(order);
});

// Get all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user');
  res.json(orders);
});

// Request return
router.post('/:id/return', protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.isReturned = true;
  order.returnReason = req.body.reason;
  await order.save();
  res.json(order);
});

module.exports = router;
