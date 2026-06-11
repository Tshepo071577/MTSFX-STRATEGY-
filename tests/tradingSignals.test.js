const request = require('supertest');
const app = require('../server');

describe('MTSFX Trading Signals API - Unit Tests', () => {
  
  // ==================== Root Endpoint Tests ====================
  describe('GET /', () => {
    it('should return API info on root endpoint', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('version', '1.0.0');
      expect(res.body).toHaveProperty('endpoints');
    });

    it('should contain correct API information', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.body.description).toBe('24/7 Automated Forex Trading Signal Dashboard');
      expect(res.body.endpoints).toHaveProperty('signals');
      expect(res.body.endpoints).toHaveProperty('documentation');
    });
  });

  // ==================== Health Check Tests ====================
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
    });

    it('should have valid timestamp format', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      const timestamp = new Date(res.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });

  // ==================== Get All Signals Tests ====================
  describe('GET /api/signals', () => {
    it('should return all trading signals', async () => {
      const res = await request(app)
        .get('/api/signals')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter signals by currency pair', async () => {
      const res = await request(app)
        .get('/api/signals?pair=EUR/USD')
        .expect(200);

      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        res.body.data.forEach(signal => {
          expect(signal.pair).toBe('EUR/USD');
        });
      }
    });

    it('should filter signals by signal type (BUY)', async () => {
      const res = await request(app)
        .get('/api/signals?signal=BUY')
        .expect(200);

      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        res.body.data.forEach(signal => {
          expect(signal.signal).toBe('BUY');
        });
      }
    });

    it('should filter signals by strength', async () => {
      const res = await request(app)
        .get('/api/signals?strength=STRONG')
        .expect(200);

      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        res.body.data.forEach(signal => {
          expect(signal.strength).toBe('STRONG');
        });
      }
    });

    it('should respect limit parameter', async () => {
      const res = await request(app)
        .get('/api/signals?limit=2')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should return signals with required fields', async () => {
      const res = await request(app)
        .get('/api/signals')
        .expect(200);

      if (res.body.data.length > 0) {
        const signal = res.body.data[0];
        expect(signal).toHaveProperty('id');
        expect(signal).toHaveProperty('pair');
        expect(signal).toHaveProperty('signal');
        expect(signal).toHaveProperty('entryPrice');
        expect(signal).toHaveProperty('stopLoss');
        expect(signal).toHaveProperty('takeProfit');
        expect(signal).toHaveProperty('strength');
        expect(signal).toHaveProperty('confidence');
        expect(signal).toHaveProperty('timestamp');
      }
    });
  });

  // ==================== Get Specific Signal Tests ====================
  describe('GET /api/signals/:id', () => {
    it('should return a specific signal by ID', async () => {
      const res = await request(app)
        .get('/api/signals/1')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent signal', async () => {
      const res = await request(app)
        .get('/api/signals/9999')
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should have correct signal structure', async () => {
      const res = await request(app)
        .get('/api/signals/1')
        .expect(200);

      const signal = res.body.data;
      expect(typeof signal.id).toBe('number');
      expect(typeof signal.pair).toBe('string');
      expect(['BUY', 'SELL', 'HOLD']).toContain(signal.signal);
      expect(typeof signal.entryPrice).toBe('number');
      expect(typeof signal.stopLoss).toBe('number');
      expect(typeof signal.takeProfit).toBe('number');
      expect(typeof signal.confidence).toBe('number');
      expect(signal.confidence).toBeGreaterThanOrEqual(0);
      expect(signal.confidence).toBeLessThanOrEqual(1);
    });
  });

  // ==================== Get Signals by Pair Tests ====================
  describe('GET /api/signals/pair/:pair', () => {
    it('should return signals for a specific pair', async () => {
      const res = await request(app)
        .get('/api/signals/pair/EUR%2FUSD')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('pair');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 404 for non-existent pair', async () => {
      const res = await request(app)
        .get('/api/signals/pair/XXX%2FYYY')
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ==================== Create Signal Tests ====================
  describe('POST /api/signals', () => {
    it('should create a new trading signal', async () => {
      const newSignal = {
        pair: 'NZD/USD',
        signal: 'BUY',
        entryPrice: 0.6150,
        stopLoss: 0.6100,
        takeProfit: 0.6250,
        strength: 'STRONG',
        confidence: 0.90
      };

      const res = await request(app)
        .post('/api/signals')
        .send(newSignal)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.pair).toBe('NZD/USD');
      expect(res.body.data.signal).toBe('BUY');
    });

    it('should assign unique ID to new signal', async () => {
      const newSignal = {
        pair: 'CAD/JPY',
        signal: 'SELL',
        entryPrice: 102.50,
        stopLoss: 103.00,
        takeProfit: 101.50,
        confidence: 0.85
      };

      const res = await request(app)
        .post('/api/signals')
        .send(newSignal)
        .expect(201);

      expect(typeof res.body.data.id).toBe('number');
      expect(res.body.data.id).toBeGreaterThan(0);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteSignal = {
        pair: 'EUR/USD',
        signal: 'BUY'
        // Missing: entryPrice, stopLoss, takeProfit
      };

      const res = await request(app)
        .post('/api/signals')
        .send(incompleteSignal)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for invalid signal type', async () => {
      const invalidSignal = {
        pair: 'EUR/USD',
        signal: 'INVALID',
        entryPrice: 1.0850,
        stopLoss: 1.0800,
        takeProfit: 1.0950
      };

      const res = await request(app)
        .post('/api/signals')
        .send(invalidSignal)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('Invalid signal type');
    });

    it('should use default values for optional fields', async () => {
      const minimalSignal = {
        pair: 'CHF/JPY',
        signal: 'HOLD',
        entryPrice: 167.80,
        stopLoss: 168.50,
        takeProfit: 166.50
      };

      const res = await request(app)
        .post('/api/signals')
        .send(minimalSignal)
        .expect(201);

      expect(res.body.data.strength).toBe('MEDIUM');
      expect(res.body.data.confidence).toBe(0.75);
    });

    it('should convert pair to uppercase', async () => {
      const newSignal = {
        pair: 'gbp/jpy',
        signal: 'buy',
        entryPrice: 189.50,
        stopLoss: 190.20,
        takeProfit: 188.50
      };

      const res = await request(app)
        .post('/api/signals')
        .send(newSignal)
        .expect(201);

      expect(res.body.data.pair).toBe('GBP/JPY');
      expect(res.body.data.signal).toBe('BUY');
    });
  });

  // ==================== Statistics Tests ====================
  describe('GET /api/signals/stats/summary', () => {
    it('should return trading statistics summary', async () => {
      const res = await request(app)
        .get('/api/signals/stats/summary')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('totalSignals');
      expect(res.body.data).toHaveProperty('buySignals');
      expect(res.body.data).toHaveProperty('sellSignals');
      expect(res.body.data).toHaveProperty('holdSignals');
      expect(res.body.data).toHaveProperty('averageConfidence');
      expect(res.body.data).toHaveProperty('pairs');
    });

    it('should have valid statistics values', async () => {
      const res = await request(app)
        .get('/api/signals/stats/summary')
        .expect(200);

      const stats = res.body.data;
      expect(typeof stats.totalSignals).toBe('number');
      expect(typeof stats.buySignals).toBe('number');
      expect(typeof stats.sellSignals).toBe('number');
      expect(typeof stats.holdSignals).toBe('number');
      expect(typeof stats.averageConfidence).toBe('number');
      expect(Array.isArray(stats.pairs)).toBe(true);

      // Verify signal counts add up
      expect(stats.buySignals + stats.sellSignals + stats.holdSignals).toEqual(stats.totalSignals);
    });

    it('should have valid confidence range', async () => {
      const res = await request(app)
        .get('/api/signals/stats/summary')
        .expect(200);

      const confidence = res.body.data.averageConfidence;
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });
  });

  // ==================== 404 Handler Tests ====================
  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'Endpoint not found');
    });

    it('should include request path and method in 404 response', async () => {
      const res = await request(app)
        .post('/nonexistent')
        .expect(404);

      expect(res.body).toHaveProperty('path');
      expect(res.body).toHaveProperty('method');
      expect(res.body.method).toBe('POST');
    });
  });

  // ==================== Response Format Tests ====================
  describe('Response Format Validation', () => {
    it('should have consistent success field in all responses', async () => {
      const endpoints = [
        { method: 'get', path: '/' },
        { method: 'get', path: '/health' },
        { method: 'get', path: '/api/signals' },
        { method: 'get', path: '/api/signals/stats/summary' }
      ];

      for (const endpoint of endpoints) {
        const res = await request(app)[endpoint.method](endpoint.path);
        expect(res.body).toHaveProperty('success');
        expect(typeof res.body.success).toBe('boolean');
      }
    });

    it('should use proper HTTP status codes', async () => {
      // Success responses
      await request(app).get('/').expect(200);
      await request(app).get('/health').expect(200);
      await request(app).get('/api/signals').expect(200);

      // Created response
      await request(app)
        .post('/api/signals')
        .send({
          pair: 'EUR/USD',
          signal: 'BUY',
          entryPrice: 1.0850,
          stopLoss: 1.0800,
          takeProfit: 1.0950
        })
        .expect(201);

      // Error responses
      await request(app).get('/api/signals/9999').expect(404);
      await request(app).post('/api/signals').send({}).expect(400);
    });
  });
});
