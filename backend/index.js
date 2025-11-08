const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');

const connectDB = require('./config/database');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(generalLimiter);

// CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Simple health check (for Render)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'ProjectMate API',
    env: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ProjectMate API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Main API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // important for Render

app.listen(PORT, HOST, () => {
  console.log(`
🚀 ProjectMate Backend Server Running
📍 Environment: ${process.env.NODE_ENV || 'production'}
🌐 Port: ${PORT}
🔗 URL: http://localhost:${PORT}
📚 API: http://localhost:${PORT}/api
🏥 Health: http://localhost:${PORT}/api/health
  `);
});

module.exports = app;
