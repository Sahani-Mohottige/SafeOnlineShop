const express = require('express');
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const router = express.Router();

//@route POST /api/checkout
//@desc Create a checkout session
//access Private
router.post("/", protect, async (req, res) => {
    const { CheckoutItems, shippingAddress, paymentMethod ,totalPrice} = req.body;

    if (!CheckoutItems || CheckoutItems.length === 0) {
        return res.status(400).json({ message: "No items found" });
    }

    try {
        //create new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            CheckoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });

        console.log(`Checkout session created for user: ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PUT /api/checkout/:id/pay
//@desc Update checkout session to mark as paid after successful payment
//access Private
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus,paymentDetails } = req.body;

    try{
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout session not found" });
        }

        if(paymentStatus === "Paid") {
        checkout.paymentStatus = paymentStatus;
        checkout.isPaid = true;
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = new Date();
         await checkout.save();

        res.status(200).json({ message: "Payment successful", checkout });
    }
    else{
        return res.status(400).json({ message: "Payment status is not valid" });
    }
} catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
      
//@router PoST /api/checkout/:id/finalize
//desc Finalize the checkout session and create an order after payment confirmation
//access Private
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout session not found" });
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            //create final order based on the checkout details
            const finalOrder = await Order.create({
            user: checkout.user,
            orderItems: checkout.CheckoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            paymentStatus: checkout.paymentStatus,
            isPaid: checkout.isPaid,
            paidAt: checkout.paidAt,
            isDelivered:false,
            paymentStatus:"paid",
            paymentDetails: checkout.paymentDetails,
            })

            //Mark the checkout session as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = new Date();
            await checkout.save();

            //Delete the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json(finalOrder);
        } else if( checkout.isFinalized) {
            return res.status(400).json({ message: "Checkout session already finalized" });
        } else {
            res.status(400).json({ message: "Checkout session is not paid yet" });
                }
            
            } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    };
});

module.exports = router;
