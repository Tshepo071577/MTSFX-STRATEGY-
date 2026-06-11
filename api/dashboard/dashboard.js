const API_URL = 'http://localhost:5000/api';
let autoRefreshInterval;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Fetch API health status
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    document.getElementById('serverStatus').textContent = '✅ Online';
    document.getElementById('serverStatus').style.color = '#4ade80';
    console.log('Server Status:', data);
  } catch (error) {
    document.getElementById('serverStatus').textContent = '❌ Offline';
    document.getElementById('serverStatus').style.color = '#ef4444';
    console.error('Server Error:', error);
  }
}

// Fetch strategies
async function fetchStrategies() {
  try {
    const response = await fetch(`${API_URL}/strategies`);
    const data = await response.json();
    displayStrategies(data.data);
    updateStats(data.data);
  } catch (error) {
    console.error('Error fetching strategies:', error);
  }
}

// Display strategies
function displayStrategies(strategies) {
  const container = document.getElementById('strategiesList');
  container.innerHTML = strategies.map(strategy => `
    <div class="strategy-card">
      <h3>${strategy.name}</h3>
      <div class="strategy-info">
        <span>Status:</span>
        <span class="status-badge status-${strategy.status}">${strategy.status.toUpperCase()}</span>
      </div>
      <div class="strategy-info">
        <span>Returns:</span>
        <span style="color: #4ade80; font-weight: bold;">${strategy.returns}</span>
      </div>
      <div class="strategy-actions">
        <button class="btn btn-primary" onclick="editStrategy(${strategy.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteStrategy(${strategy.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Update statistics
function updateStats(strategies) {
  const activeCount = strategies.filter(s => s.status === 'active').length;
  const totalReturn = strategies.reduce((sum, s) => {
    const returns = parseFloat(s.returns);
    return sum + returns;
  }, 0);
  
  document.getElementById('activeCount').textContent = activeCount;
  document.getElementById('totalReturn').textContent = totalReturn.toFixed(2) + '%';
}

// Create strategy
document.getElementById('createStrategyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const strategyData = {
    name: document.getElementById('strategyName').value,
    config: {
      type: document.getElementById('strategyType').value,
      riskLevel: document.getElementById('riskLevel').value
    }
  };
  
  try {
    const response = await fetch(`${API_URL}/strategies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strategyData)
    });
    
    if (response.ok) {
      alert('Strategy created successfully!');
      document.getElementById('createStrategyForm').reset();
      fetchStrategies();
    }
  } catch (error) {
    console.error('Error creating strategy:', error);
    alert('Error creating strategy');
  }
});

// Edit strategy
function editStrategy(id) {
  alert(`Edit functionality for strategy ${id} - Coming soon!`);
}

// Delete strategy
async function deleteStrategy(id) {
  if (!confirm('Are you sure you want to delete this strategy?')) return;
  
  try {
    const response = await fetch(`${API_URL}/strategies/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('Strategy deleted successfully!');
      fetchStrategies();
    }
  } catch (error) {
    console.error('Error deleting strategy:', error);
    alert('Error deleting strategy');
  }
}

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', () => {
  fetchStrategies();
  checkServerStatus();
});

// Auto-refresh settings
document.getElementById('autoRefresh').addEventListener('change', (e) => {
  if (e.target.checked) {
    autoRefreshInterval = setInterval(() => {
      fetchStrategies();
      checkServerStatus();
    }, 30000);
  } else {
    clearInterval(autoRefreshInterval);
  }
});

// Dark mode (placeholder)
document.getElementById('darkMode').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.style.filter = 'invert(1)';
  } else {
    document.body.style.filter = 'none';
  }
});

// Initialize on load
window.addEventListener('load', () => {
  checkServerStatus();
  fetchStrategies();
  
  if (document.getElementById('autoRefresh').checked) {
    autoRefreshInterval = setInterval(() => {
      fetchStrategies();
      checkServerStatus();
    }, 30000);
  }
});
