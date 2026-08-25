const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI || '';

  // 1. Remove wrapping quotes and whitespace
  uri = uri.trim().replace(/^["']|["']$/g, '');

  // 2. Strip any accidental leading "MONGO_URI=" or "MONGODB_URI=" prefixes
  if (uri.startsWith('MONGO_URI=')) {
    uri = uri.replace(/^MONGO_URI=/, '').trim();
  }
  if (uri.startsWith('MONGODB_URI=')) {
    uri = uri.replace(/^MONGODB_URI=/, '').trim();
  }

  // Fallback direct connection string if env variable fails to load
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    uri = 'mongodb+srv://avnishmaurya3223_db_user:SBrzDjpP5REUyNuH@cluster0.prszjgh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;