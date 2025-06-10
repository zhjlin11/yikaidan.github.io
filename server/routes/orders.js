const express = require('express');
const router = express.Router();
const { Order, Customer, Product } = require('../models');
const generateSeal = require('../utils/sealGenerator');
const generatePayCode = require('../utils/qrcode');

// List all orders with associated customer and product
router.get('/', async (req, res) => {
  const orders = await Order.findAll({ include: [Customer, Product] });
  res.json(orders);
});

// Get single order by id
router.get('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [Customer, Product] });
  if (!order) return res.status(404).end();
  res.json(order);
});

// Create a new order and attach seal/QR code
router.post('/', async (req, res) => {
  const order = await Order.create(req.body);
  const seal = generateSeal(`Order ${order.id}`);
  const payCode = await generatePayCode(`PAY:${order.id}`);
  await order.update({ seal, payCode });
  res.status(201).json(order);
});

// Update an order
router.put('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).end();
  await order.update(req.body);
  res.json(order);
});

// Delete an order
router.delete('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).end();
  await order.destroy();
  res.status(204).end();
});

module.exports = router;
