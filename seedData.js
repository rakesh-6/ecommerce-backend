require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared existing data");

    // Create sample users
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@ecommerce.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@ecommerce.com",
        password: "user123",
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@ecommerce.com",
        password: "user123",
        role: "user",
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create sample products
    const products = await Product.create([
      {
        name: "Laptop",
        description: "High performance laptop for professionals",
        price: 89999,
        image: "https://via.placeholder.com/300?text=Laptop",
        countInStock: 10,
        user: users[0]._id,
      },
      {
        name: "Smartphone",
        description: "Latest smartphone with advanced features",
        price: 49999,
        image: "https://via.placeholder.com/300?text=Smartphone",
        countInStock: 25,
        user: users[0]._id,
      },
      {
        name: "Headphones",
        description: "Wireless noise-cancelling headphones",
        price: 9999,
        image: "https://via.placeholder.com/300?text=Headphones",
        countInStock: 50,
        user: users[0]._id,
      },
      {
        name: "Smart Watch",
        description: "Fitness tracking smart watch",
        price: 19999,
        image: "https://via.placeholder.com/300?text=SmartWatch",
        countInStock: 30,
        user: users[0]._id,
      },
      {
        name: "Tablet",
        description: "10-inch display tablet with stylus",
        price: 34999,
        image: "https://via.placeholder.com/300?text=Tablet",
        countInStock: 15,
        user: users[0]._id,
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create sample orders
    const orders = await Order.create([
      {
        user: users[1]._id,
        orderItems: [
          {
            name: products[0].name,
            qty: 1,
            image: products[0].image,
            price: products[0].price,
            product: products[0]._id,
          },
          {
            name: products[2].name,
            qty: 2,
            image: products[2].image,
            price: products[2].price,
            product: products[2]._id,
          },
        ],
        totalPrice: products[0].price + products[2].price * 2,
      },
      {
        user: users[2]._id,
        orderItems: [
          {
            name: products[1].name,
            qty: 1,
            image: products[1].image,
            price: products[1].price,
            product: products[1]._id,
          },
          {
            name: products[3].name,
            qty: 1,
            image: products[3].image,
            price: products[3].price,
            product: products[3]._id,
          },
        ],
        totalPrice: products[1].price + products[3].price,
      },
    ]);
    console.log(`✅ Created ${orders.length} orders`);

    console.log("\n✨ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
