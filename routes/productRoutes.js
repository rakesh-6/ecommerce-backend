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
console.log("protect:", protect);
console.log("admin:", admin);
console.log("createProduct:", createProduct);

router.route("/")
  .post(protect, admin, createProduct)
  .get(getProducts);

router.route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;