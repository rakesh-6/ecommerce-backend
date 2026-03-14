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
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
      name: {
        $regex: req.query.keyword,
        $options: "i",
      },
    }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const minPrice = Number(req.query.minPrice) || 0;
  const maxPrice = Number(req.query.maxPrice) || Infinity;
  const priceFilter = { price: { $gte: minPrice, $lte: maxPrice === Infinity ? 1000000 : maxPrice } };

  const count = await Product.countDocuments({ ...keyword, ...category, ...priceFilter });
  const products = await Product.find({ ...keyword, ...category, ...priceFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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