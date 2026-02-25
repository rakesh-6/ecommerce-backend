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
      {
        name: "USB-C Cable",
        description: "Fast charging USB-C cable, 2 meters",
        price: 599,
        image: "https://via.placeholder.com/300?text=USBCable",
        countInStock: 100,
        user: users[0]._id,
      },
      {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking",
        price: 1999,
        image: "https://via.placeholder.com/300?text=WirelessMouse",
        countInStock: 40,
        user: users[0]._id,
      },
      {
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with mechanical switches",
        price: 7999,
        image: "https://via.placeholder.com/300?text=Keyboard",
        countInStock: 20,
        user: users[0]._id,
      },
      {
        name: "Monitor 27-inch",
        description: "4K Ultra HD monitor with HDR support",
        price: 29999,
        image: "https://via.placeholder.com/300?text=Monitor",
        countInStock: 12,
        user: users[0]._id,
      },
      {
        name: "Webcam HD",
        description: "1080p HD webcam with auto-focus",
        price: 3999,
        image: "https://via.placeholder.com/300?text=Webcam",
        countInStock: 35,
        user: users[0]._id,
      },
      {
        name: "Portable Speaker",
        description: "Waterproof bluetooth speaker with 12-hour battery",
        price: 4999,
        image: "https://via.placeholder.com/300?text=Speaker",
        countInStock: 45,
        user: users[0]._id,
      },
      {
        name: "Phone Case",
        description: "Durable protective phone case",
        price: 499,
        image: "https://via.placeholder.com/300?text=PhoneCase",
        countInStock: 200,
        user: users[0]._id,
      },
      {
        name: "Screen Protector",
        description: "Tempered glass screen protector pack of 2",
        price: 299,
        image: "https://via.placeholder.com/300?text=ScreenProtector",
        countInStock: 150,
        user: users[0]._id,
      },
      {
        name: "Charger Adapter",
        description: "65W universal charger with multiple ports",
        price: 2499,
        image: "https://via.placeholder.com/300?text=ChargerAdapter",
        countInStock: 60,
        user: users[0]._id,
      },
      {
        name: "Power Bank",
        description: "20000mAh portable power bank with fast charging",
        price: 2999,
        image: "https://via.placeholder.com/300?text=PowerBank",
        countInStock: 55,
        user: users[0]._id,
      },
      {
        name: "Laptop Bag",
        description: "Water-resistant laptop backpack for 15-inch laptops",
        price: 1999,
        image: "https://via.placeholder.com/300?text=LaptopBag",
        countInStock: 30,
        user: users[0]._id,
      },
      {
        name: "Laptop Stand",
        description: "Adjustable aluminium laptop stand",
        price: 1299,
        image: "https://via.placeholder.com/300?text=LaptopStand",
        countInStock: 50,
        user: users[0]._id,
      },
      {
        name: "External SSD 1TB",
        description: "Portable 1TB external SSD with USB-C",
        price: 8999,
        image: "https://via.placeholder.com/300?text=ExternalSSD",
        countInStock: 25,
        user: users[0]._id,
      },
      {
        name: "USB Hub",
        description: "7-port USB 3.0 hub with power adapter",
        price: 1599,
        image: "https://via.placeholder.com/300?text=USBHub",
        countInStock: 40,
        user: users[0]._id,
      },
      {
        name: "HDMI Cable",
        description: "2-meter HDMI 2.1 cable for 4K video",
        price: 799,
        image: "https://via.placeholder.com/300?text=HDMICable",
        countInStock: 80,
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
