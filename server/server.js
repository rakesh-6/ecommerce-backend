require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
