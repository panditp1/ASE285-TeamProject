const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const request = require('supertest');
const mongoose = require('mongoose');
const Item = require('../server/models/Item');

const baseURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_main';
const jestDbName = `inventory_test_jest_${Date.now()}`;
const testURI = baseURI.replace(/\/[^/]+$/, `/${jestDbName}`);
console.log('Test DB URI:', testURI);

jest.setTimeout(20000);

let app;

beforeAll(async () => {
  await mongoose.connect(testURI);
  app = require('../server/index');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Inventory API', () => {
  let itemId;

  test('POST /api/items - create a new item', async () => {
    const newItem = {
      name: 'Test Item',
      quantity: 10,
      price: 19.99,
      category: 'Test',
      tags: ['example', 'test']
    };

    const response = await request(app)
      .post('/api/items')
      .send(newItem)
      .expect(201);

    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe('Test Item');
    itemId = response.body._id;
  });

  test('GET /api/items - retrieve all items', async () => {
    const response = await request(app)
      .get('/api/items')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('PUT /api/items/:id - update item quantity', async () => {
    expect(itemId).toBeDefined();

    const response = await request(app)
      .put(`/api/items/${itemId}`)
      .send({ quantity: 15 })
      .expect(200);

    expect(response.body.quantity).toBe(15);
  });

  test('DELETE /api/items/:id - delete an item', async () => {
    expect(itemId).toBeDefined();

    await request(app)
      .delete(`/api/items/${itemId}`)
      .expect(200);

    const item = await Item.findById(itemId);
    expect(item).toBeNull();
  });
});
