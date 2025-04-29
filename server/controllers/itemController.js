const Item = require('../models/Item');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    console.log("Received form data:", req.body);

    const { name, quantity, price, category, tags = [] } = req.body;

    if (!name || !quantity || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const item = new Item({
      name,
      quantity,
      price,
      category,
      tags
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(" Error in createItem:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!item.history) item.history = [];
    item.history.push({
      quantity: item.quantity,
      timestamp: new Date()
    });

    item.name = req.body.name;
    item.quantity = req.body.quantity;
    item.price = req.body.price;
    item.category = req.body.category;
    item.tags = req.body.tags;

    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.importCSV = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const results = [];

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filePath = path.join(uploadsDir, file.name);

    file.mv(filePath, err => {
      if (err) return res.status(500).send(err);

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', data => {
          results.push({
            name: data.name,
            quantity: Number(data.quantity),
            price: Number(data.price),
            category: data.category,
            tags: data.tags ? data.tags.split(';').map(t => t.trim()) : []
          });
        })
        .on('end', async () => {
          try {
            await Item.insertMany(results);
            fs.unlinkSync(filePath); // Clean up uploaded CSV
            res.send('CSV imported successfully');
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
        });
    });
  } catch (err) {
    console.error(" Error in importCSV:", err);
    res.status(500).json({ message: 'Server error during CSV import' });
  } //making changes
};
