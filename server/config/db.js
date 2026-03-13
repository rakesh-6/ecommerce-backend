const mongoose = require("mongoose");

const connectDB = async (providedUri) => {
  try {
    const mongoUri = providedUri || process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ CRITICAL: No MONGO_URI found in environment variables or arguments.");
      throw new Error("MONGO_URI environment variable is not set!");
    }

    // Security-safe logging: Show only the cluster part, hide credentials
    const maskedUri = mongoUri.includes("@")
      ? `mongodb+srv://****:****@${mongoUri.split("@")[1]}`
      : "Invalid Format (credentials missing)";

    console.log("🔍 Database Connection Attempt:");
    console.log(`   Target: ${maskedUri}`);
    console.log(`   Source: ${providedUri ? "Manual Argument" : "Process Environment"}`);

    if (process.env.NODE_ENV === "production" && (mongoUri.includes("localhost") || mongoUri.includes("127.0.0.1"))) {
      console.error("🛑 SECURITY ALERT: Production mode detected but MONGO_URI points to localhost!");
      throw new Error("CRITICAL: MONGO_URI is pointing to localhost on Render! Please update your Render Dashboard Environment Variables.");
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 20000, // Slightly faster timeout for quicker feedback in logs
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failure: ${error.message}`);
    // Only exit in production to allow the app to restart/recover if needed,
    // or to show clear failure in Render logs.
    process.exit(1);
  }
};

module.exports = connectDB;