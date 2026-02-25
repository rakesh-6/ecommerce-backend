const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
} = require("../controllers/userController");

// Public routes
router.post("/", registerUser);
router.post("/login", authUser);

// Protected routes
router.get("/profile", protect, getUserProfile);

// Admin routes
router.get("/", protect, admin, getUsers);

module.exports = router;