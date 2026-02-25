const asyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const Order = require("../models/order");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE PAYMENT ORDER =================
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;

  if (!amount || !orderId) {
    res.status(400);
    throw new Error("Amount and Order ID are required");
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: orderId,
      payment_capture: 1, // Auto capture payment
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// ================= VERIFY PAYMENT =================
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing payment verification details");
  }

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(401);
    throw new Error("Payment verification failed");
  }

  // Update order as paid
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentMethod = "Razorpay";
  order.transactionId = razorpay_payment_id;
  order.status = "processing";

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: "Payment verified successfully",
    order: updatedOrder,
  });
});

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
