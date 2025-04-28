import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPage() {
  const [items, setItems] = useState([]);


  const fetchItems = () => {
    axios.get('/api/items')
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]));
  
  
    };

  useEffect(() => {
    fetchItems();
  }, []);

  
  const totalItems = items.length;
  const lowStock = items.filter(item => item.quantity < 5);
  const totalValue = items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);
  const mostStocked = [...items].sort((a, b) => b.quantity - a.quantity).slice(0, 3);

  const categoryMap = {};

  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const dynamicCategories = Object.keys(categoryMap);
  const categoryCounts = Object.values(categoryMap);

  const categoryData = {
    labels: dynamicCategories,
    datasets: [
      {
        label: 'Category Distribution',
        data: categoryCounts,
        backgroundColor: [
          '#6c63ff', '#00c9a7', '#ff6b6b', '#ffa500', '#2d98da',
          '#9b59b6', '#3498db', '#e67e22', '#2ecc71', '#34495e',
          '#fd79a8', '#00cec9', '#e84393', '#0984e3' // (optional extra colors)
        ],
        borderWidth: 1
      }
    ]
  };

  const today = new Date();
  const upcomingReminders = items
    .filter(item => item.restockBy)
    .map(item => ({
      name: item.name,
      date: new Date(item.restockBy),
      isPast: new Date(item.restockBy) < today
    }))
    .sort((a, b) => a.date - b.date);

  return (
    <main className="container">
      <h2>Inventory Overview</h2>

      {/* refresh button */}
      <button onClick={fetchItems} className="refresh-button"> Refresh</button>

      <div className="dashboard">
        <div className="stat-box">Total Items: {totalItems}</div>
        <div className="stat-box">Categories: {dynamicCategories.length}</div>
        <div className="stat-box">Low Stock: {lowStock.length}</div>
        <div className="stat-box">Inventory Value: ${totalValue}</div>
      </div>

      <div className="dashboard-section">
        <h3>Category Breakdown</h3>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Pie data={categoryData} />
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Top 3 Stocked Items</h3>
        <ul>
          {mostStocked.map((item, index) => (
            <li key={item._id}>
              {index + 1}. {item.name} (Qty: {item.quantity})
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Low Stock Items</h3>
        <ul>
          {lowStock.map(item => (
            <li key={item._id}>{item.name} (Qty: {item.quantity})</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default DashboardPage;
