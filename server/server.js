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
    credentials: true,
  })
);

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Production: Serve built frontend from client/dist
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../client/dist");
  app.use(express.static(buildPath));

  // SPA fallback — Use a regex to catch anything that isn't an API route
  // This is the most stable way to do a catch-all in Express 5.x
  app.get(/^((?!\/api).)*$/, (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Running...");
  });
}

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("\n================================");
  console.log("🚀 E-Commerce Server Started");
  console.log("================================");
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || devOrigins.join(", ")}`);
  console.log(`🗄️ Mode: ${process.env.NODE_ENV || "development"}`);
  console.log("================================\n");
});
