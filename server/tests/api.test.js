const request = require('supertest');
jest.mock("../utils/sealGenerator", () => jest.fn(() => "SEAL"));
jest.mock("../utils/qrcode", () => jest.fn(async () => "QRCODE"));


process.env.MYSQL_URI = 'sqlite::memory:';
const app = require('../app');
const { sequelize, Customer, Product, Order } = require('../models');

beforeAll(async () => {
  await sequelize.sync();
});

let token;

beforeEach(async () => {
  await sequelize.truncate({ cascade: true });
  await request(app)
    .post('/auth/register')
    .send({ username: 'tester', password: 'pass123' });
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'tester', password: 'pass123' });
  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth', () => {
  test('register and login', async () => {
    let res = await request(app)
      .post('/auth/register')
      .send({ username: 'alice', password: 'pass123' });
    expect(res.status).toBe(201);

    res = await request(app)
      .post('/auth/login')
      .send({ username: 'alice', password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('Customer CRUD', () => {
  test('create, read, update and delete', async () => {
    let res = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John', email: 'john@example.com' });
    expect(res.status).toBe(201);
    const id = res.body.id;

    res = await request(app).get(`/customers/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('john@example.com');

    res = await request(app)
      .put(`/customers/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Johnny' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Johnny');

    res = await request(app)
      .delete(`/customers/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

});

describe('Product CRUD', () => {
  test('create, read, update and delete', async () => {
    let res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Widget', price: 9.99 });
    expect(res.status).toBe(201);
    const id = res.body.id;

    res = await request(app).get(`/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.price).toBe('9.99');

    res = await request(app)
      .put(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 19.99 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe('19.99');

    res = await request(app)
      .delete(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});

describe('Order CRUD', () => {
  beforeEach(async () => {
    await sequelize.truncate({ cascade: true });
  });

  test('create, read, update and delete', async () => {
    const customer = await Customer.create({
      name: 'Alice',
      email: 'alice@example.com',
    });
    const product = await Product.create({ name: 'Gadget', price: 5 });

    let res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        CustomerId: customer.id,
        ProductId: product.id,
        quantity: 2,
      });
    expect(res.status).toBe(201);
    const id = res.body.id;

    res = await request(app).get(`/orders/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.CustomerId).toBe(customer.id);
    expect(res.body.ProductId).toBe(product.id);

    res = await request(app)
      .put(`/orders/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(3);

    res = await request(app)
      .delete(`/orders/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  test('reject invalid ids', async () => {
    const customer = await Customer.create({
      name: 'Bob',
      email: 'bob@example.com',
    });
    const product = await Product.create({ name: 'Widget', price: 2 });

    let res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ CustomerId: 9999, ProductId: product.id, quantity: 1 });
    expect(res.status).toBe(400);

    res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ CustomerId: customer.id, ProductId: 9999, quantity: 1 });
    expect(res.status).toBe(400);

    const order = await Order.create({
      CustomerId: customer.id,
      ProductId: product.id,
      quantity: 1,
    });

    res = await request(app)
      .put(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ CustomerId: 8888 });
    expect(res.status).toBe(400);

    res = await request(app)
      .put(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ProductId: 8888 });
    expect(res.status).toBe(400);
  });
});
