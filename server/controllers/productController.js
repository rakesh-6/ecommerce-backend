const asyncHandler = require("express-async-handler");
const Product = require("../models/product");

// ================= CREATE PRODUCT =================
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, countInStock } = req.body;
  const product = new Product({ name, price, description, countInStock });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// ================= GET ALL PRODUCTS =================
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// ================= GET PRODUCT BY ID =================
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("user", "name email");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// ================= UPDATE PRODUCT =================
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user is the product owner or admin
  if (product.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }

  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  product.description = req.body.description || product.description;
  product.image = req.body.image || product.image;
  product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// ================= DELETE PRODUCT =================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user is the product owner or admin
  if (product.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product removed" });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};