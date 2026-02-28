const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔍 MongoDB URI:", process.env.MONGO_URI ? "Found" : "NOT FOUND");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set!");
    }

    if (process.env.NODE_ENV === "production" && process.env.MONGO_URI.includes("localhost")) {
      throw new Error("CRITICAL: MONGO_URI is pointing to localhost on Render! Please check your Render Environment Variables.");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
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