const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');            

const router = express.Router();

//@route POST /api/orders
//@desc Create a new order for the logged-in user
//@access Private
router.post('/', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            dateOfPurchase,
            deliveryTime,
            deliveryLocation,
            message
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            username: req.user.name || req.user.nickname || '',
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            dateOfPurchase,
            deliveryTime,
            deliveryLocation,
            message,
            status: 'Processing'
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//@route GET /api/orders/my-orders
//@desc Get all orders for the logged-in user
//@access Private
router.get('/my-orders', protect, async (req, res) => {
    try {
        // Find orders for the authenticated user and populate username
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name');
        // Add username field for convenience
        const ordersWithUsername = orders.map(order => ({
            ...order.toObject(),
            username: order.user?.name || '',
        }));
        res.status(200).json({ orders: ordersWithUsername });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//@route GET /api/orders/:id
//@desc Get order by ID for the logged-in user
//@access Private
router.get("/:id", protect, async (req, res) => {
    console.log("Order ID requested:", req.params.id);
    try{
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate(
            'user',
            'name email'
        );
        if(!order){
            return res.status(404).json({ message: 'Order not found or access denied' });
        }
        //return full order details
        res.json(order);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
)


//@route POST /api/orders/:id/cancel
//@desc Cancel an order for the logged-in user
//@access Private
router.post('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }
        order.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
