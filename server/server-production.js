require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS Configuration
const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const devOrigins = ["http://localhost:5173", "http://localhost:5174"];
const allowedOrigins = configuredOrigins.length ? configuredOrigins : devOrigins;

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser clients (curl/Postman) with no Origin header
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Production: Serve built frontend from client/dist
const buildPath = path.join(__dirname, "../client/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(buildPath));
  // Serve index.html for all routes (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

const server = app.listen(PORT, () => {
  console.log("\n================================");
  console.log("🚀 E-Commerce Server Started");
  console.log("================================");
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || devOrigins.join(", ")}`);
  console.log(`🗄️ Mode: ${process.env.NODE_ENV || "development"}`);
  console.log("================================\n");
});

module.exports = server;
