# Forex Trading Signals API Documentation

## Overview
The Forex Trading Signals API provides real-time trading signals for forex currency pairs. It enables users to fetch, create, and analyze trading signals with confidence levels, entry/exit points, and signal strength metrics.

---

## Base URL
```
http://localhost:3000/api/signals
```

---

## Authentication
Currently, the API does not require authentication. In production, implement JWT or API key authentication.

---

## Endpoints

### 1. Get All Trading Signals
**GET** `/api/signals`

Fetch all trading signals with optional filtering.

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `pair` | string | Filter by currency pair | `EUR/USD` |
| `signal` | string | Filter by signal type (BUY, SELL, HOLD) | `BUY` |
| `strength` | string | Filter by strength (STRONG, MEDIUM, WEAK) | `STRONG` |
| `limit` | integer | Number of results to return (default: 10) | `5` |

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/signals?pair=EUR/USD&signal=BUY&limit=5"
```

#### Response Example (200 OK)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "pair": "EUR/USD",
      "signal": "BUY",
      "entryPrice": 1.0850,
      "stopLoss": 1.0800,
      "takeProfit": 1.0950,
      "strength": "STRONG",
      "timestamp": "2026-06-11T10:30:00.000Z",
      "confidence": 0.92
    }
  ]
}
```

---

### 2. Get Specific Trading Signal
**GET** `/api/signals/:id`

Retrieve a single trading signal by ID.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Trading signal ID |

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/signals/1"
```

#### Response Example (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "pair": "EUR/USD",
    "signal": "BUY",
    "entryPrice": 1.0850,
    "stopLoss": 1.0800,
    "takeProfit": 1.0950,
    "strength": "STRONG",
    "timestamp": "2026-06-11T10:30:00.000Z",
    "confidence": 0.92
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": "Trading signal not found"
}
```

---

### 3. Create New Trading Signal
**POST** `/api/signals`

Create a new trading signal.

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pair` | string | Yes | Currency pair (e.g., EUR/USD, GBP/USD) |
| `signal` | string | Yes | Signal type: BUY, SELL, or HOLD |
| `entryPrice` | number | Yes | Entry price for the trade |
| `stopLoss` | number | Yes | Stop loss price |
| `takeProfit` | number | Yes | Take profit price |
| `strength` | string | No | Signal strength: STRONG, MEDIUM, WEAK (default: MEDIUM) |
| `confidence` | number | No | Confidence level 0-1 (default: 0.75) |

#### Request Example
```bash
curl -X POST "http://localhost:3000/api/signals" \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "GBP/JPY",
    "signal": "SELL",
    "entryPrice": 189.50,
    "stopLoss": 190.20,
    "takeProfit": 188.50,
    "strength": "STRONG",
    "confidence": 0.85
  }'
```

#### Response Example (201 Created)
```json
{
  "success": true,
  "message": "Trading signal created successfully",
  "data": {
    "id": 5,
    "pair": "GBP/JPY",
    "signal": "SELL",
    "entryPrice": 189.50,
    "stopLoss": 190.20,
    "takeProfit": 188.50,
    "strength": "STRONG",
    "confidence": 0.85,
    "timestamp": "2026-06-11T12:00:00.000Z"
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Missing required fields: pair, signal, entryPrice, stopLoss, takeProfit"
}
```

---

### 4. Get Signals by Currency Pair
**GET** `/api/signals/pair/:pair`

Fetch all signals for a specific currency pair.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `pair` | string | Currency pair (e.g., EUR/USD) |

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/signals/pair/EUR/USD"
```

#### Response Example (200 OK)
```json
{
  "success": true,
  "pair": "EUR/USD",
  "count": 1,
  "data": [
    {
      "id": 1,
      "pair": "EUR/USD",
      "signal": "BUY",
      "entryPrice": 1.0850,
      "stopLoss": 1.0800,
      "takeProfit": 1.0950,
      "strength": "STRONG",
      "timestamp": "2026-06-11T10:30:00.000Z",
      "confidence": 0.92
    }
  ]
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": "No signals found for pair EUR/USD"
}
```

---

### 5. Get Trading Statistics
**GET** `/api/signals/stats/summary`

Retrieve summary statistics of all trading signals.

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/signals/stats/summary"
```

#### Response Example (200 OK)
```json
{
  "success": true,
  "data": {
    "totalSignals": 4,
    "buySignals": 2,
    "sellSignals": 1,
    "holdSignals": 1,
    "averageConfidence": 0.81,
    "pairs": [
      "EUR/USD",
      "GBP/USD",
      "USD/JPY",
      "AUD/USD"
    ]
  }
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource successfully created |
| `400` | Bad Request - Invalid parameters or missing required fields |
| `404` | Not Found - Resource does not exist |
| `500` | Internal Server Error - Server error |

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message (if available)"
}
```

---

## Data Models

### Trading Signal Object
```json
{
  "id": 1,
  "pair": "EUR/USD",
  "signal": "BUY",
  "entryPrice": 1.0850,
  "stopLoss": 1.0800,
  "takeProfit": 1.0950,
  "strength": "STRONG",
  "confidence": 0.92,
  "timestamp": "2026-06-11T10:30:00.000Z"
}
```

### Field Descriptions
- **id**: Unique identifier for the trading signal
- **pair**: Currency pair (e.g., EUR/USD)
- **signal**: Trading action (BUY, SELL, HOLD)
- **entryPrice**: Recommended entry price
- **stopLoss**: Stop loss price level
- **takeProfit**: Take profit target price
- **strength**: Signal reliability (STRONG, MEDIUM, WEAK)
- **confidence**: Confidence level (0.0 - 1.0)
- **timestamp**: Signal creation timestamp (ISO 8601)

---

## Supported Currency Pairs

The API supports the following currency pairs:
- EUR/USD (Euro/US Dollar)
- GBP/USD (British Pound/US Dollar)
- USD/JPY (US Dollar/Japanese Yen)
- AUD/USD (Australian Dollar/US Dollar)
- GBP/JPY (British Pound/Japanese Yen)
- And more...

---

## Usage Examples

### Example 1: Get All BUY Signals
```bash
curl -X GET "http://localhost:3000/api/signals?signal=BUY"
```

### Example 2: Get Strong Signals for EUR/USD
```bash
curl -X GET "http://localhost:3000/api/signals?pair=EUR/USD&strength=STRONG"
```

### Example 3: Create a HOLD Signal
```bash
curl -X POST "http://localhost:3000/api/signals" \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "USD/CAD",
    "signal": "HOLD",
    "entryPrice": 1.3650,
    "stopLoss": 1.3700,
    "takeProfit": 1.3600,
    "strength": "WEAK",
    "confidence": 0.60
  }'
```

### Example 4: Get Statistics
```bash
curl -X GET "http://localhost:3000/api/signals/stats/summary"
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps
1. Clone the repository:
```bash
git clone https://github.com/Tshepo071577/MTSFX-STRATEGY-.git
cd MTSFX-STRATEGY-
```

2. Install dependencies:
```bash
npm install express
```

3. Create a main server file (e.g., `server.js`):
```javascript
const express = require('express');
const tradingSignalsRouter = require('./api/tradingSignals');

const app = express();
app.use(express.json());

app.use('/api/signals', tradingSignalsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

4. Start the server:
```bash
node server.js
```

5. Access the API at `http://localhost:3000/api/signals`

---

## Rate Limiting
Currently, there is no rate limiting implemented. In production, implement rate limiting to prevent abuse.

---

## Future Enhancements
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication (JWT)
- [ ] Real-time signal streaming (WebSocket)
- [ ] Signal history and backtesting
- [ ] Email/SMS notifications
- [ ] Advanced filtering and sorting
- [ ] Signal performance analytics

---

## Support & Issues
For bugs, feature requests, or support, please create an issue on GitHub.

---

## License
This project is licensed under the MIT License.

---

**Last Updated:** June 11, 2026
**API Version:** 1.0.0
