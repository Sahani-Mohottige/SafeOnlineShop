const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true }
},
{ _id: false });

const orderSchema = new mongoose.Schema({
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
        enum: ['10 AM', '11 AM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'],
        required: true
    },
    deliveryLocation: {
        type: String,
        required: true
    },
    orderItems: [orderItemSchema],
    message: {
        type: String
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    isDeliveredAt: {
        type: Date
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending'
    },
    status: {
        type: String,
        required: true,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);