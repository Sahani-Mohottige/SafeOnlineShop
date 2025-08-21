const mongoose = require('mongoose');

const checkoutItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, 
{_id: false}
);

const checkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  CheckoutItems: [checkoutItemSchema],
  shippingAddress: {
    address: {
      type: String,
      required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
},
    paymentMethod: {
        type: String,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true,
    },
    isPaid:{
        type: Boolean,
        required: true,
    },
    paidAt: {
        type: Date,
    },
    paymentStatus:{
        type: String,
        required: true,
        default: 'Pending'
    },
    paymentDetails:{
        type:mongoose.Schema.Types.Mixed,
    },
    isFinalized:{
        type: Boolean,
        default: false
    },
    finalizedAt:{
        type: Date,
    },
},
{timestamps: true}
);

const Checkout = mongoose.model('Checkout', checkoutSchema); 
module.exports = Checkout;