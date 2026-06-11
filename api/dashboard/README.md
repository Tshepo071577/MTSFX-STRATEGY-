# MTSFX Strategy API Dashboard

## Overview
A comprehensive API dashboard for managing MTSFX trading strategies with 24/7 automated indicators.

## Features
- ✅ Real-time API status monitoring
- ✅ Strategy CRUD operations
- ✅ Performance metrics display
- ✅ Auto-refresh capabilities
- ✅ Responsive design
- ✅ RESTful API integration

## Installation

### Backend Setup
```bash
cd api/dashboard
npm install
```

### Configuration
1. Copy `.env.example` to `.env`
2. Update environment variables as needed

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Strategies
- `GET /api/strategies` - Get all strategies
- `GET /api/strategies/:id` - Get specific strategy
- `POST /api/strategies` - Create new strategy
- `PUT /api/strategies/:id` - Update strategy
- `DELETE /api/strategies/:id` - Delete strategy

## Frontend

Open `dashboard.html` in your browser to access the dashboard UI.

### Tabs
1. **Overview** - API status and key metrics
2. **Strategies** - View and manage strategies
3. **Create Strategy** - Add new trading strategies
4. **Settings** - Configure dashboard behavior

## Technologies
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful

## Project Structure
```
api/dashboard/
├── server.js          # Express server
├── dashboard.html     # Main dashboard UI
├── dashboard.js       # Frontend logic
├── styles.css         # Dashboard styles
├── package.json       # Dependencies
├── .env.example       # Environment template
└── README.md          # This file
```

## Future Enhancements
- [ ] WebSocket real-time updates
- [ ] User authentication
- [ ] Database integration
- [ ] Advanced charting
- [ ] Email notifications
- [ ] Multi-strategy portfolio analysis

## License
MIT

## Support
For issues and questions, please open an issue in the repository.
