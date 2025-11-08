// =======================
// ProjectMate Backend
// =======================

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

// =======================
// CORS setup (simple + clean, Classtro-style)
// =======================
const allowedBaseDomains = [
  'project-mate-eight.vercel.app',
  'www.project-mate-eight.vercel.app',
  'localhost'
];

// Helper to check if the request origin is allowed
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow requests like Postman / server-to-server
  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    // ✅ Allow from known base domains
    if (allowedBaseDomains.includes(hostname)) return true;

    // ✅ Allow any preview subdomain from Vercel ending with 'vercel.app'
    if (hostname.endsWith('vercel.app') && hostname.includes('project-mate')) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// =======================
// Health + Root routes
// =======================

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

// =======================
// Server startup
// =======================
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // required for Render

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
