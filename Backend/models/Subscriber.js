const mongoose = require('mongoose');
const { subscribe } = require('../routes/uploadRoutes');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    subscribeAt: {
        type: Date,
        default: Date.now
    },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
