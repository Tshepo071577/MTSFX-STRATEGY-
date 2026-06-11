const express = require('express');
const cors = require('cors');
const tradingSignalsRouter = require('./api/tradingSignals');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/signals', tradingSignalsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MTSFX Trading Signals API',
    version: '1.0.0',
    description: '24/7 Automated Forex Trading Signal Dashboard',
    endpoints: {
      signals: '/api/signals',
      documentation: 'https://github.com/Tshepo071577/MTSFX-STRATEGY-/blob/main/API_DOCUMENTATION.md'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Server configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          MTSFX TRADING SIGNALS API - STARTED               ║
╚════════════════════════════════════════════════════════════╝

🚀 Server Status: RUNNING
📍 Base URL: http://${HOST}:${PORT}
📚 Documentation: https://github.com/Tshepo071577/MTSFX-STRATEGY-/blob/main/API_DOCUMENTATION.md
❤️  Health Check: http://${HOST}:${PORT}/health

Available Endpoints:
  📊 GET  /api/signals - Fetch all trading signals
  📈 GET  /api/signals/:id - Get specific signal
  ➕ POST /api/signals - Create new signal
  🔍 GET  /api/signals/pair/:pair - Get signals by pair
  📉 GET  /api/signals/stats/summary - Get statistics

Environment:
  • Node Version: ${process.version}
  • Port: ${PORT}
  • Environment: ${process.env.NODE_ENV || 'development'}

${process.env.NODE_ENV === 'production' ? '✅ Running in PRODUCTION mode\n' : '⚠️  Running in DEVELOPMENT mode\n'}
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
