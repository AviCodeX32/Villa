const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Route imports
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seoRoutes = require('./routes/seoRoutes');

const app = express();

// 1. Security & Logging Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin image resources from Cloudinary
}));
app.use(morgan('dev'));

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:4000',
  'http://localhost:5173',
  'http://localhost:5175',
  'http://localhost:5174',
  'https://villa-aveee1.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. API Endpoints
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', seoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 5. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// 6. Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
