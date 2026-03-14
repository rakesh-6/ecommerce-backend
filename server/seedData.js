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

    console.log("Starting database clear...");
    await User.deleteMany({});
    console.log("Cleared users");
    await Product.deleteMany({});
    console.log("Cleared products");
    await Order.deleteMany({});
    console.log("Cleared orders");
    console.log("Cleared existing data");

    console.log("Starting user creation...");
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
        name: "Premium Ultra Laptop",
        description: "High performance laptop with 32GB RAM and 1TB SSD",
        price: 129999,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80",
        countInStock: 5,
        category: "Electronics",
        user: users[0]._id,
      },
      {
        name: "Pro Smartphone X",
        description: "Flagship smartphone with 108MP camera",
        price: 79999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
        countInStock: 15,
        category: "Electronics",
        user: users[0]._id,
      },
      {
        name: "Noise Cancel Headphones",
        description: "Studio quality wireless headphones",
        price: 14999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        countInStock: 20,
        category: "Electronics",
        user: users[0]._id,
      },
      {
        name: "Designer Leather Jacket",
        description: "Premium handcrafted leather jacket",
        price: 5999,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80",
        countInStock: 10,
        category: "Fashion",
        user: users[0]._id,
      },
      {
        name: "Silk Evening Dress",
        description: "Elegant silk dress for special occasions",
        price: 8999,
        image: "https://images.unsplash.com/photo-1539008835279-43469eead72d?auto=format&fit=crop&w=500&q=80",
        countInStock: 8,
        category: "Fashion",
        user: users[0]._id,
      },
      {
        name: "Modern Ceramic Vase",
        description: "Minimalist ceramic vase for home decor",
        price: 2499,
        image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=500&q=80",
        countInStock: 12,
        category: "Home",
        user: users[0]._id,
      },
      {
        name: "Smart Coffee Maker",
        description: "App-controlled coffee brewing system",
        price: 11999,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80",
        countInStock: 6,
        category: "Home",
        user: users[0]._id,
      },
      {
        name: "Running Shoes Air",
        description: "Comfortable and durable running shoes",
        price: 4999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
        countInStock: 25,
        category: "Fashion",
        user: users[0]._id,
      },
      {
        name: "Ergonomic Office Chair",
        description: "Breathable mesh chair for long working hours",
        price: 15999,
        image: "https://images.unsplash.com/photo-1505797149-35ebcb05a6fd?auto=format&fit=crop&w=500&q=80",
        countInStock: 10,
        category: "Home",
        user: users[0]._id,
      },
      {
        name: "Gamer Ultra Monitor",
        description: "144Hz 4K gaming monitor with HDR",
        price: 44999,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80",
        countInStock: 7,
        category: "Electronics",
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
