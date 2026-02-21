require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
connectDB();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use(notFound);
app.use(errorHandler);
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));


app.get("/", (req, res) => {
  res.send("API Running...");
});


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

console.log("User Routes Loaded");
