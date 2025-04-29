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

  const itemCounts = {};
  items.forEach(item => {
    const normalized = item.name.trim().toLowerCase();
    itemCounts[normalized] = (itemCounts[normalized] || 0) + item.quantity;
  });

  const totalItems = items.length;
  const totalValue = items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);

  const mostStocked = Object.entries(itemCounts)
    .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
    .slice(0, 3)
    .map(([name, quantity]) => ({ name, quantity }));

  const lowStock = Object.entries(itemCounts)
    .filter(([, quantity]) => quantity < 5)
    .map(([name, quantity]) => ({ name, quantity }));

  const itemsWithHistory = items.filter(item => (item.history?.length || 0) > 0);

  const sortedByPopularity = [...itemsWithHistory].sort(
    (a, b) => b.history.length - a.history.length
  );

  const top3MostPopular = sortedByPopularity.slice(0, 3);
  const bottom3LeastPopular = sortedByPopularity.slice(-3);

  const sameTopBottom = JSON.stringify(top3MostPopular) === JSON.stringify(bottom3LeastPopular);

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
          '#fd79a8', '#00cec9', '#e84393', '#0984e3'
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

      <button onClick={fetchItems} className="refresh-button">Refresh</button>

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
        <h2>Inventory Status</h2>

        <div className="sub-section">
          <h3>Top 3 Stocked Items</h3>
          <div className="top-stocked-list">
            {mostStocked.map((item, index) => (
              <div key={index}>
                {index + 1}. {item.name} (Qty: {item.quantity})
              </div>
            ))}
          </div>
        </div>

        <div className="sub-section">
          <h3>Low Stock Items</h3>
          <div className="low-stock-list">
            {lowStock.map((item, index) => (
              <div key={index}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)} (Qty: {item.quantity})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Item Popularity</h2>

        <div className="sub-section">
          <h3>Top 3 Most Popular Items</h3>
          <ol>
            {top3MostPopular.length > 0 ? (
              top3MostPopular.map((item) => (
                <li key={item._id}>
                  {item.name} ({item.history?.length || 0} updates)
                </li>
              ))
            ) : (
              <p>No popular items yet.</p>
            )}
          </ol>
        </div>

        <div className="sub-section">
          <h3>Top 3 Least Popular Items</h3>
          {!sameTopBottom && bottom3LeastPopular.length > 0 ? (
            <ol>
              {bottom3LeastPopular.map((item) => (
                <li key={item._id}>
                  {item.name} ({item.history?.length || 0} updates)
                </li>
              ))}
            </ol>
          ) : (
            <p>No least popular items yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
