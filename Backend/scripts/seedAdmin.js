const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const run = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI || '';
  uri = uri.trim().replace(/^["']|["']$/g, '');
  if (uri.startsWith('MONGO_URI=')) uri = uri.replace(/^MONGO_URI=/, '').trim();
  if (uri.startsWith('MONGODB_URI=')) uri = uri.replace(/^MONGODB_URI=/, '').trim();

  try {
    const conn = await mongoose.connect(uri);
    console.log(`Connected to database: ${conn.connection.name}`);

    const username = 'avi';
    const password = 'avi'; // Change this to your desired password

    // 1. Delete any existing record for this user
    await Admin.deleteMany({ username: 'avi' });

    // 2. Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert directly without triggering redundant pre-save hooks
    const newAdmin = await Admin.collection.insertOne({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('-----------------------------------');
    console.log('✅ Admin "avi" created successfully!');
    console.log(`Username: avi`);
    console.log(`Password: avi`);
    console.log(`Hashed in DB: ${hashedPassword}`);
    console.log('-----------------------------------');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();