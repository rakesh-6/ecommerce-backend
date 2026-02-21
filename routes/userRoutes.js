const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  getUsers,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/", protect, admin, getUsers);

module.exports = router;