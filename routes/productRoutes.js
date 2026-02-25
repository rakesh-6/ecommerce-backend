const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Get all products and Create new product
router.route("/")
  .get(getProducts)
  .post(protect, admin, createProduct);

// Get, update, delete specific product
router.route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;