const express = require('express');
const router = express.Router();

// Mock database of trading signals
const tradingSignals = [
  {
    id: 1,
    pair: 'EUR/USD',
    signal: 'BUY',
    entryPrice: 1.0850,
    stopLoss: 1.0800,
    takeProfit: 1.0950,
    strength: 'STRONG',
    timestamp: new Date('2026-06-11T10:30:00Z'),
    confidence: 0.92
  },
  {
    id: 2,
    pair: 'GBP/USD',
    signal: 'SELL',
    entryPrice: 1.2650,
    stopLoss: 1.2700,
    takeProfit: 1.2500,
    strength: 'MEDIUM',
    timestamp: new Date('2026-06-11T09:15:00Z'),
    confidence: 0.78
  },
  {
    id: 3,
    pair: 'USD/JPY',
    signal: 'HOLD',
    entryPrice: 155.30,
    stopLoss: 155.80,
    takeProfit: 154.50,
    strength: 'WEAK',
    timestamp: new Date('2026-06-11T08:00:00Z'),
    confidence: 0.65
  },
  {
    id: 4,
    pair: 'AUD/USD',
    signal: 'BUY',
    entryPrice: 0.6720,
    stopLoss: 0.6680,
    takeProfit: 0.6850,
    strength: 'STRONG',
    timestamp: new Date('2026-06-11T11:45:00Z'),
    confidence: 0.88
  }
];

/**
 * GET /api/signals
 * Fetch all trading signals
 * Query params:
 *   - pair: Filter by currency pair (e.g., EUR/USD)
 *   - signal: Filter by signal type (BUY, SELL, HOLD)
 *   - strength: Filter by strength (STRONG, MEDIUM, WEAK)
 *   - limit: Number of results to return (default: 10)
 */
router.get('/', (req, res) => {
  try {
    let signals = [...tradingSignals];

    // Filter by currency pair
    if (req.query.pair) {
      signals = signals.filter(s => s.pair.toUpperCase() === req.query.pair.toUpperCase());
    }

    // Filter by signal type
    if (req.query.signal) {
      signals = signals.filter(s => s.signal === req.query.signal.toUpperCase());
    }

    // Filter by strength
    if (req.query.strength) {
      signals = signals.filter(s => s.strength === req.query.strength.toUpperCase());
    }

    // Sort by timestamp (newest first)
    signals.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    const limit = parseInt(req.query.limit) || 10;
    signals = signals.slice(0, limit);

    res.json({
      success: true,
      count: signals.length,
      data: signals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trading signals',
      message: error.message
    });
  }
});

/**
 * GET /api/signals/:id
 * Fetch a specific trading signal by ID
 */
router.get('/:id', (req, res) => {
  try {
    const signal = tradingSignals.find(s => s.id === parseInt(req.params.id));

    if (!signal) {
      return res.status(404).json({
        success: false,
        error: 'Trading signal not found'
      });
    }

    res.json({
      success: true,
      data: signal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trading signal',
      message: error.message
    });
  }
});

/**
 * POST /api/signals
 * Create a new trading signal
 */
router.post('/', (req, res) => {
  try {
    const { pair, signal, entryPrice, stopLoss, takeProfit, strength, confidence } = req.body;

    // Validation
    if (!pair || !signal || !entryPrice || !stopLoss || !takeProfit) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: pair, signal, entryPrice, stopLoss, takeProfit'
      });
    }

    const validSignals = ['BUY', 'SELL', 'HOLD'];
    if (!validSignals.includes(signal.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signal type. Must be BUY, SELL, or HOLD'
      });
    }

    const newSignal = {
      id: Math.max(...tradingSignals.map(s => s.id)) + 1,
      pair: pair.toUpperCase(),
      signal: signal.toUpperCase(),
      entryPrice: parseFloat(entryPrice),
      stopLoss: parseFloat(stopLoss),
      takeProfit: parseFloat(takeProfit),
      strength: strength?.toUpperCase() || 'MEDIUM',
      confidence: parseFloat(confidence) || 0.75,
      timestamp: new Date()
    };

    tradingSignals.push(newSignal);

    res.status(201).json({
      success: true,
      message: 'Trading signal created successfully',
      data: newSignal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create trading signal',
      message: error.message
    });
  }
});

/**
 * GET /api/signals/pair/:pair
 * Fetch all signals for a specific currency pair
 */
router.get('/pair/:pair', (req, res) => {
  try {
    const signals = tradingSignals.filter(
      s => s.pair.toUpperCase() === req.params.pair.toUpperCase()
    );

    if (signals.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No signals found for pair ${req.params.pair}`
      });
    }

    signals.sort((a, b) => b.timestamp - a.timestamp);

    res.json({
      success: true,
      pair: req.params.pair.toUpperCase(),
      count: signals.length,
      data: signals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch signals for pair',
      message: error.message
    });
  }
});

/**
 * GET /api/signals/stats
 * Get trading signals statistics
 */
router.get('/stats/summary', (req, res) => {
  try {
    const buySignals = tradingSignals.filter(s => s.signal === 'BUY').length;
    const sellSignals = tradingSignals.filter(s => s.signal === 'SELL').length;
    const holdSignals = tradingSignals.filter(s => s.signal === 'HOLD').length;
    const avgConfidence = (tradingSignals.reduce((sum, s) => sum + s.confidence, 0) / tradingSignals.length).toFixed(2);

    res.json({
      success: true,
      data: {
        totalSignals: tradingSignals.length,
        buySignals,
        sellSignals,
        holdSignals,
        averageConfidence: parseFloat(avgConfidence),
        pairs: [...new Set(tradingSignals.map(s => s.pair))]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

module.exports = router;
