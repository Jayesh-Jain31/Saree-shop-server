// seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import products from './data/products.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    return Product.deleteMany(); // clear old products
  })
  .then(() => {
    return Product.insertMany(products); // insert new
  })
  .then(() => {
    console.log('✅ Products seeded!');
    process.exit();
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
