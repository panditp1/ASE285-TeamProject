const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    category: String,
    tags: [String],
    updatedAt: { type: Date, default: Date.now },
    history: [{
      quantity: Number,
      timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Item', itemSchema);
