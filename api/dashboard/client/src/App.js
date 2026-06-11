import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MTSFX API Dashboard</h1>
        <p>Welcome to your trading strategy dashboard</p>
      </header>

      <main className="dashboard-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {dashboardData && (
          <div className="dashboard-content">
            <h2>{dashboardData.title}</h2>
            <p>Version: {dashboardData.version}</p>
            <p>Last Updated: {new Date(dashboardData.timestamp).toLocaleString()}</p>
          </div>
        )}

        <section className="widgets">
          <div className="widget">
            <h3>Trading Pairs</h3>
            <p>View and manage trading pairs</p>
          </div>
          <div className="widget">
            <h3>Strategies</h3>
            <p>Monitor active strategies</p>
          </div>
          <div className="widget">
            <h3>Performance</h3>
            <p>Track portfolio performance</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
