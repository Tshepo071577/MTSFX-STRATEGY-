# MTSFX API Dashboard

A full-stack application for monitoring and managing MTSFX trading strategies.

## Project Structure

```
api/dashboard/
├── server.js                 # Express server entry point
├── package.json             # Backend dependencies
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json        # Frontend dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the project directory:
```bash
cd api/dashboard
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

4. Install backend dependencies:
```bash
npm install
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Return to the root directory:
```bash
cd ..
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The backend will run on `http://localhost:5000`
The frontend will run on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Available API Endpoints

- `GET /api/health` - Health check
- `GET /api/dashboard` - Get dashboard data

## Features

- Real-time dashboard monitoring
- Trading pair management
- Strategy monitoring
- Performance tracking
- Responsive design

## Technologies Used

### Backend
- Express.js - Web framework
- Node.js - Runtime
- CORS - Cross-origin requests
- Body-parser - Request parsing

### Frontend
- React 18 - UI library
- Axios - HTTP client
- CSS3 - Styling

## Contributing

Please ensure all code follows the project standards before submitting pull requests.

## License

MIT
