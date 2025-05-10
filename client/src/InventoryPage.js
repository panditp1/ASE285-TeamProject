import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useUser } from './UserContext';
import 'chart.js/auto';

function InventoryPage() {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletedItem, setDeletedItem] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', category: '', tags: '' });
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [visibleChartId, setVisibleChartId] = useState(null);

  const fetchItems = () => {
    axios.get('/api/items')
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const itemToDelete = items.find(item => item._id === id);
    setItems(prev => prev.filter(item => item._id !== id));
    setDeletedItem(itemToDelete);

    const timeout = setTimeout(async () => {
      try {
        await axios.delete(`/api/items/${id}`, {
          data: { userEmail: user?.email }
        });
        setDeletedItem(null);
      } catch (err) {
        console.error('Permanent delete failed:', err);
        fetchItems();
      }
    }, 5000);

    setUndoTimeout(timeout);
  };

  const handleUndo = () => {
    clearTimeout(undoTimeout);
    setItems(prev => [deletedItem, ...prev]);
    setDeletedItem(null);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
      tags: item.tags.join('; ')
    });
    setEditingId(item._id);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const tagsArray = form.tags.split(';').map(tag => tag.trim()).filter(Boolean);
    const payload = { ...form, tags: tagsArray, userEmail: user?.email };

    try {
      if (editingId) {
        await axios.put(`/api/items/${editingId}`, payload);
        setSuccessMessage('Item updated successfully!');
      } else {
        await axios.post('/api/items', payload);
        setSuccessMessage('Item added successfully!');
      }

      fetchItems();
      setForm({ name: '', quantity: '', price: '', category: '', tags: '' });
      setEditingId(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleExport = () => {
    const csvData = items.map(({ _id, ...rest }) => ({ ...rest, tags: rest.tags.join(';') }));
    const blob = new Blob([
      Object.keys(csvData[0] || {}).join(',') + '\n' +
      csvData.map(row => Object.values(row).join(',')).join('\n')
    ], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('/api/items/import', formData);
      fetchItems();
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  const toggleChart = id => {
    setVisibleChartId(prev => (prev === id ? null : id));
  };

  const categories = ['All', ...new Set(items.map(item => item.category))];

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory);

  return (
    <main className="container">
      <h2>My Inventory</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {deletedItem && (
        <div className="undo-banner">
          <span>Item "{deletedItem.name}" deleted.</span>
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <input name="name" placeholder="Item Name" value={form.name} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="tags" placeholder="Tags (e.g. tech;blue)" value={form.tags} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update Item' : 'Add Item'}</button>
      </form>

      <div className="controls">
        <button onClick={handleExport}>Export CSV</button>
        <label className="import-label">
          Import CSV
          <input type="file" accept=".csv" onChange={handleImport} hidden />
        </label>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />

      <div className="category-filter">
        <label htmlFor="category">Sort by category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <ul className="item-list">
        {filteredItems.map(item => (
          <li key={item._id} className="item">
            <strong>{item.name}</strong> – Qty: {item.quantity} – ${item.price.toFixed(2)}<br />
            <em>Category:</em> {item.category} &nbsp;&nbsp;&nbsp;
            <em>Tags:</em> {item.tags.join(', ')}
            <div className="actions">
              <button onClick={() => handleEdit(item)}>✏️</button>
              <button onClick={() => handleDelete(item._id)}>🗑️</button>
              <button onClick={() => toggleChart(item._id)}>
                {visibleChartId === item._id ? 'Hide Graph' : 'View Graph'}
              </button>
            </div>

            {visibleChartId === item._id && (
              <Bar
                data={{
                  labels: [
                    ...(item.history || []).map(h => new Date(h.timestamp).toLocaleString()),
                    'Now'
                  ],
                  datasets: [{
                    label: `${item.name} Quantity Over Time`,
                    data: [...(item.history || []).map(h => h.quantity), item.quantity],
                    backgroundColor: 'rgba(75,192,192,0.6)'
                  }]
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default InventoryPage;
