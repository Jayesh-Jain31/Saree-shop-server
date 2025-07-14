const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 👉 Create Razorpay Payment Order
router.post('/create-payment', protect, async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Payment creation failed', error: err.message });
  }
});

// 👉 Place an Order (COD or prepaid)
router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user.id,
      items: req.body.items,
      address: req.body.address,
      paymentStatus: req.body.paymentStatus || 'Pending',
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Order creation failed', error: err.message });
  }
});

// 👉 Get All Orders (Admin Only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// 👉 Mark Order as Returned (within 24 hrs)
router.post('/:id/return', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const placedTime = new Date(order.createdAt).getTime();
    const now = Date.now();
    const hoursPassed = (now - placedTime) / (1000 * 60 * 60);

    if (hoursPassed > 24) {
      return res.status(403).json({ message: 'Return window expired (24 hours)' });
    }

    order.isReturned = true;
    order.returnReason = req.body.reason || 'Not specified';
    await order.save();

    res.json({ message: 'Return request accepted', order });
  } catch (err) {
    res.status(500).json({ message: 'Return failed', error: err.message });
  }
});

module.exports = router;

