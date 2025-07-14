const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      qty: Number,
      price: Number,
    },
  ],
  address: String,
  paymentStatus: String,
  isReturned: { type: Boolean, default: false },
  returnReason: String,
});

module.exports = mongoose.model('Order', orderSchema);
