import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

function ItemListPage() {
  const [items, setItems] = useState([]);

  useEffect(() => 
    {
    axios.get('/api/items')
      .then(res => {
        setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <main className="container">
      <h2> Inventory List</h2>
      <ul className="item-list">
        {items.map(item => (
          <li key={item._id} className="item">
            <strong>{item.name}</strong> ({item.category})<br />
            Quantity: {item.quantity}<br />
            Price: ${item.price.toFixed(2)}<br />
            Tags: {item.tags.join(', ')}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default ItemListPage;
