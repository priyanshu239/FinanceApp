const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const { errorHandler, ErrorResponse } = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/authRoutes');
const records = require('./routes/recordRoutes');
const dashboard = require('./routes/dashboardRoutes');
const users = require('./routes/userRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser? Use it if available, but express-validator uses JSON body

// Enable CORS
app.use(cors());

// Security Middleware
app.use(helmet());
// NOTE: mongoSanitize and hpp are disabled to maintain compatibility with Express 5.x immutability

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 1000
});
app.use('/api', limiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check for Vercel
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ZORVYN Finance API is online and stable',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/records', records);
app.use('/api/dashboard', dashboard);

// 404 Catch-all for undefined routes
app.use((req, res, next) => {
  next(new ErrorResponse(`Route ${req.originalUrl} not found`, 404));
});

// Error handler
app.use(errorHandler);

module.exports = app;
