const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'API Server is running', timestamp: new Date() });
});

// Get all strategies
app.get('/api/strategies', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Strategy 1', status: 'active', returns: '12.5%' },
      { id: 2, name: 'Strategy 2', status: 'inactive', returns: '8.3%' }
    ]
  });
});

// Get strategy by ID
app.get('/api/strategies/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    data: { id, name: `Strategy ${id}`, status: 'active', returns: '12.5%' }
  });
});

// Create new strategy
app.post('/api/strategies', (req, res) => {
  const { name, config } = req.body;
  res.status(201).json({
    success: true,
    message: 'Strategy created',
    data: { id: Date.now(), name, config, status: 'created' }
  });
});

// Update strategy
app.put('/api/strategies/:id', (req, res) => {
  const { id } = req.params;
  const { name, config } = req.body;
  res.json({
    success: true,
    message: 'Strategy updated',
    data: { id, name, config, status: 'updated' }
  });
});

// Delete strategy
app.delete('/api/strategies/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: `Strategy ${id} deleted`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`API Dashboard Server running on port ${PORT}`);
});

module.exports = app;
