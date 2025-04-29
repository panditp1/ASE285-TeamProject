import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletedItem, setDeletedItem] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', category: '', tags: '' });
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchItems = () => {
    axios.get('/api/items')
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (clickedItem) => {
    const normalizedClickedName = clickedItem.name.trim().toLowerCase();
    const normalizedClickedCategory = clickedItem.category.trim().toLowerCase();

    const matchingItems = items.filter(item =>
      item.name.trim().toLowerCase() === normalizedClickedName &&
      item.category.trim().toLowerCase() === normalizedClickedCategory
    );

    try {
      await Promise.all(matchingItems.map(item =>
        axios.delete(`/api/items/${item._id}`)
      ));
      setSuccessMessage(`Deleted all "${clickedItem.name}" items.`);
      fetchItems();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting items:', err);
      fetchItems();
    }
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
    const payload = { ...form, tags: tagsArray };

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

  const categories = ['All', ...new Set(items.map(item => item.category))];

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory);

  const groupedItems = {};
  filteredItems.forEach(item => {
    const key = item.name.trim().toLowerCase() + '|' + (item.category?.trim().toLowerCase() || 'uncategorized');
    if (!groupedItems[key]) {
      groupedItems[key] = { ...item, quantity: Number(item.quantity), price: Number(item.price) };
    } else {
      groupedItems[key].quantity += Number(item.quantity);
      groupedItems[key].price += Number(item.price);
    }
  });
  const finalItems = Object.values(groupedItems);

  const lowStock = finalItems.filter(item => item.quantity < 5);

  return (
    <main className="container">
      <h2>My Inventory</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

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

        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Shoes">Shoes</option>
          <option value="Stationery">Stationery</option>
          <option value="Tech">Tech</option>
          <option value="Drinks">Drinks</option>
          <option value="Fruits">Fruits</option>
          <option value="Books">Books</option>
          <option value="Cosmetics">Cosmetics</option>
        </select>

        <input name="tags" placeholder="Tags (e.g. tech;blue)" value={form.tags} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update Item' : 'Add Item'}</button>
      </form>

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
        {finalItems.map(item => (
          <li key={item._id || item.name + item.category} className="item">
            <strong>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</strong> – Qty: {item.quantity} – ${item.price.toFixed(2)}<br />
            <em>Category:</em> {item.category} &nbsp;&nbsp;&nbsp;
            <em>Tags:</em> {item.tags.join(', ')}

            <div className="actions">
              <button onClick={() => handleEdit(item)}>✏️</button>
              <button onClick={() => handleDelete(item)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Low Stock Items</h3>
      <ul className="low-stock-list">
        {lowStock.map((item, index) => (
          <li key={index}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)} (Qty: {item.quantity})
          </li>
        ))}
      </ul>
    </main>
  );
}

export default InventoryPage;
