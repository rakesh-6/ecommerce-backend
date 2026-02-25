const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ================= PROTECT ROUTES =================
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// ================= ADMIN CHECK =================
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin access only");
  }
};

module.exports = { protect, admin };