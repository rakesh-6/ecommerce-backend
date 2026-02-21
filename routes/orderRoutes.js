const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const {
  addOrderItems,
  getMyOrders,
  getOrders,
} = require("../controllers/orderController");

router.route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route("/myorders")
  .get(protect, getMyOrders);

module.exports = router;

