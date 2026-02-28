const mongoose = require("mongoose");

const connectDB = async (providedUri) => {
  try {
    const mongoUri = providedUri || process.env.MONGO_URI;
    console.log("🔍 Connecting to MongoDB:", mongoUri ? mongoUri.split("@")[1] : "NOT FOUND");

    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set!");
    }

    if (process.env.NODE_ENV === "production" && mongoUri.includes("localhost")) {
      throw new Error("CRITICAL: MONGO_URI is pointing to localhost on Render! Please check your Render Environment Variables.");
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;