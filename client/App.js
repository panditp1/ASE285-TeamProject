import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './styles.css';

function App() {

    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: '', quantity: '', price: '', category: '', tags: '' });
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [visibleChartId, setVisibleChartId] = useState(null);

    const fetchItems = async () => {
        try {
            const res = await axios.get('/api/items');

            if (Array.isArray(res.data)) {
                setItems(res.data);
            } else {
                console.error("Response was not an array:", res.data);
                setItems([]);
            }
        } catch (err) {
            console.error("Failed to fetch items:", err);
            setItems([]);
        }
    };


    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const tagsArray = form.tags.split(';').map(tag => tag.trim()).filter(Boolean);
        const payload = { ...form, tags: tagsArray, userEmail: user?.email }; 
      
          if (editingId) {
            await axios.put(`/api/items/${editingId}`, payload);
          } else {
            await axios.post('/api/items', payload);
          }
          setForm({ name: '', quantity: '', price: '', category: '', tags: '' });
          setEditingId(null);
          fetchItems();
      };

    const handleEdit = item => {
        setForm({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
            tags: item.tags.join('; ')
        });
        setEditingId(item._id);
    };

    const handleDelete = async id => {
        await axios.delete(`/api/items/${id}`, { data: { userEmail: user?.email } });
        fetchItems();
      };
      

    const handleExport = () => {
        const csvData = items.map(({ _id, ...rest }) => ({ ...rest, tags: rest.tags.join(';') }));
        const blob = new Blob([
            Object.keys(csvData[0]).join(',') + '\n' +
            csvData.map(row => Object.values(row).join(',')).join('\n')
        ], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory.csv';
        a.click();
    };

    const handleImport = async e => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        await axios.post('/api/items/import', formData);
        fetchItems();
    };

    if (!Array.isArray(items)) return <div>No items available yet. Try importing a CSV.</div>;

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleChart = id => {
        setVisibleChartId(prev => (prev === id ? null : id));
    };

    return (
        <div className="container">
            <h1>Inventory Manager</h1>
            <input className="search" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
            <form onSubmit={handleSubmit} className="form">
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
                <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
                <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
                <input name="tags" placeholder="Tags (e.g. tech;blue)" value={form.tags} onChange={handleChange} />
                <button type="submit">{editingId ? 'Update' : 'Add'} Item</button>
            </form>
            <div className="controls">
                <button onClick={handleExport}>Export CSV</button>
                <label className="import-label">Import CSV
                    <input type="file" accept=".csv" onChange={handleImport} hidden />
                </label>
            </div>
            <ul className="item-list">
                {filteredItems.map(item => (
                    <li key={item._id} className="item">
                        <div>
                            <strong>{item.name}</strong> ({item.category})<br />
                            Qty: {item.quantity} - ${item.price.toFixed(2)}<br />
                            <em>Tags:</em> {item.tags.join(', ')}<br />
                            <button onClick={() => toggleChart(item._id)}>
                                {visibleChartId === item._id ? 'Hide' : 'View'} Graph
                            </button>
                            {visibleChartId === item._id && (
                                <Bar
                                    data={{
                                        labels: [
                                            ...(item.history || []).map(h =>
                                                new Date(h.timestamp).toLocaleString()
                                            ),
                                            'Now'
                                        ],
                                        datasets: [
                                            {
                                                label: `${item.name} Quantity Over Time`,
                                                data: [
                                                    ...(item.history || []).map(h => h.quantity),
                                                    item.quantity
                                                ],
                                                backgroundColor: 'rgba(75,192,192,0.6)'
                                            }
                                        ]
                                    }}
                                />
                            )}

                        </div>
                        <span className="actions">
                            <button onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
