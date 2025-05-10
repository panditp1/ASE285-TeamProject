import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './styles.css';

function HomePage() {
  const { user } = useUser();
  const [form, setForm] = useState({ name: '', quantity: '', price: '', category: '', tags: '' });
  const [tagCount, setTagCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedItem = localStorage.getItem('editItem');
    if (storedItem) {
      const item = JSON.parse(storedItem);
      setForm({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        tags: item.tags.join('; ')
      });
      setEditingId(item._id);
      setTagCount(item.tags.length);
      localStorage.removeItem('editItem');
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'tags') {
      const count = value.split(';').map(t => t.trim()).filter(Boolean).length;
      setTagCount(count);
    }
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
        setSuccessMessage('Item has been added successfully!');
      }
      setForm({ name: '', quantity: '', price: '', category: '', tags: '' });
      setTagCount(0);
      setEditingId(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="container">
      <h1>Inventory Manager</h1>

      {successMessage && <div className="success-message">{successMessage}</div>}

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
        <p className="tag-count">{tagCount} tag{tagCount !== 1 ? 's' : ''}</p>
        <button type="submit">{editingId ? 'Update' : 'Add'} Item</button>
      </form>
    </main>
  );
}

export default HomePage;
