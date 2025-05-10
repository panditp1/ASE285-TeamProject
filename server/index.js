const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { parse } = require('json2csv');
const csv = require('csv-parser');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/items', require('./routes/itemRoutes'));

const Item = require('./models/Item');

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const emails = process.env.LOGIN_EMAILS.split(',');
  const passwords = process.env.LOGIN_PASSWORDS.split(',');

  const index = emails.findIndex((e) => e.trim() === email);
  if (index !== -1 && passwords[index].trim() === password) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const results = await Item.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

const startServer = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      (process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/inventory_test' : undefined);

    if (!mongoURI) {
      throw new Error('MongoDB URI is undefined');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    if (require.main === module) {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};


startServer();

module.exports = app;

