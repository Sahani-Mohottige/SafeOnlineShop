const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  dateOfPurchase: {
    type: Date,
    required: true
  },
  deliveryTime: {
    type: String,
    enum: ['10 AM', '11 AM', '12 PM'],
    required: true
  },
  deliveryLocation: {
    type: String,
    required: true
  },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      size: { type: String },
      color: { type: String },
      price: { type: Number, required: true }
    }
  ],
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
