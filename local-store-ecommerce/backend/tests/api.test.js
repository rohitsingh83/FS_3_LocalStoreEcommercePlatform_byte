'use strict';

require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Product = require('../src/models/Product');
const Cart = require('../src/models/Cart');

jest.setTimeout(30000);

describe('Local Store E-Commerce Platform API Suite', () => {
  let sampleInStockProduct;
  let sampleOutOfStockProduct;
  const testSessionId = 'test-session-' + Date.now();

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
      await Product.deleteMany({});
      await Cart.deleteMany({});

      sampleInStockProduct = await Product.create({
        title: 'Organic Honeycrisp Apples',
        category: 'produce',
        price: 3.99,
        description: 'Crisp and juicy local orchard apples.',
        origin: 'Apple Hill Orchards',
        unit: '1 lb',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
      });

      sampleOutOfStockProduct = await Product.create({
        title: 'Artisanal Seeded Sourdough',
        category: 'bakery',
        price: 6.5,
        description: 'Naturally leavened seeded loaf.',
        origin: 'Old Town Hearth',
        unit: '1 loaf',
        stock: 0, // OUT OF STOCK
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      });
    } catch (err) {
      console.warn('MongoDB not reachable for test run:', err.message);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('Health Endpoint', () => {
    it('GET /health returns 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('local-store-api');
    });
  });

  describe('Product Retrieval Endpoints', () => {
    it('GET /api/v1/products returns all products', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.products.length).toBeGreaterThanOrEqual(2);
    });

    it('GET /api/v1/products with ?category=produce filters properly', async () => {
      const res = await request(app).get('/api/v1/products?category=produce');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products.every((p) => p.category === 'produce')).toBe(true);
    });

    it('GET /api/v1/products with ?search=Honeycrisp finds match', async () => {
      const res = await request(app).get('/api/v1/products?search=Honeycrisp');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products.length).toBe(1);
      expect(res.body.data.products[0].title).toContain('Honeycrisp');
    });

    it('GET /api/v1/products/:id returns specific product details', async () => {
      const res = await request(app).get(`/api/v1/products/${sampleInStockProduct._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.product._id).toBe(sampleInStockProduct._id.toString());
      expect(res.body.data.product.price).toBe(3.99);
      expect(res.body.data.product.stockStatus).toBe('in_stock');
    });

    it('GET /api/v1/products/:id with non-existent ID returns 404', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/v1/products/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Cart Operations Endpoints', () => {
    it('GET /api/v1/cart returns empty session cart initially', async () => {
      const res = await request(app)
        .get('/api/v1/cart')
        .set('x-session-id', testSessionId);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.cart.items.length).toBe(0);
      expect(res.body.data.cart.totalItems).toBe(0);
      expect(res.body.data.cart.subtotal).toBe(0);
    });

    it('POST /api/v1/cart/items prevents adding out-of-stock items (400)', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('x-session-id', testSessionId)
        .send({ productId: sampleOutOfStockProduct._id.toString(), quantity: 1 });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('out of stock');
    });

    it('POST /api/v1/cart/items adds an in-stock product successfully', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('x-session-id', testSessionId)
        .send({ productId: sampleInStockProduct._id.toString(), quantity: 2 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.cart.items.length).toBe(1);
      expect(res.body.data.cart.totalItems).toBe(2);
      expect(res.body.data.cart.subtotal).toBe(7.98);
    });

    it('POST /api/v1/cart/items enforces stock limit (cannot exceed stock of 10)', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('x-session-id', testSessionId)
        .send({ productId: sampleInStockProduct._id.toString(), quantity: 9 }); // 2 + 9 = 11 > 10
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('only 10 are in stock');
    });

    it('PATCH /api/v1/cart/items/:productId updates quantity', async () => {
      const res = await request(app)
        .patch(`/api/v1/cart/items/${sampleInStockProduct._id}`)
        .set('x-session-id', testSessionId)
        .send({ quantity: 5 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.cart.items[0].quantity).toBe(5);
      expect(res.body.data.cart.subtotal).toBe(19.95);
    });

    it('DELETE /api/v1/cart/items/:productId removes item from cart', async () => {
      const res = await request(app)
        .delete(`/api/v1/cart/items/${sampleInStockProduct._id}`)
        .set('x-session-id', testSessionId);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.cart.items.length).toBe(0);
      expect(res.body.data.cart.subtotal).toBe(0);
    });

    it('DELETE /api/v1/cart clears entire cart', async () => {
      // First re-add item
      await request(app)
        .post('/api/v1/cart/items')
        .set('x-session-id', testSessionId)
        .send({ productId: sampleInStockProduct._id.toString(), quantity: 1 });

      const res = await request(app)
        .delete('/api/v1/cart')
        .set('x-session-id', testSessionId);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.cart.items.length).toBe(0);
    });
  });
});
