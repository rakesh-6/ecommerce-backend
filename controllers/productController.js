const asyncHandler = require("express-async-handler");
const Product = require("../models/product");

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, countInStock } = req.body;
  const product = new Product({ name, price, description, countInStock });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  product.description = req.body.description || product.description;
  product.countInStock = req.body.countInStock || product.countInStock;
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ message: "Product removed" });
});

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };