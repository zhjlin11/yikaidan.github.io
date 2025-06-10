const express = require('express');
const router = express.Router();
const { Order, Customer, Product } = require('../models');
const generateSeal = require('../utils/sealGenerator');
const generatePayCode = require('../utils/qrcode');

router.get('/', async (req, res) => {
  const orders = await Order.findAll({ include: [Customer, Product] });
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [Customer, Product] });
  if (!order) return res.status(404).end();
  res.json(order);
});

router.post('/', async (req, res) => {
  const order = await Order.create(req.body);
  const seal = generateSeal(`Order ${order.id}`);
  order.sealImage = seal;
  order.payCode = await generatePayCode(`pay://order/${order.id}`);
  await order.save();
  res.status(201).json(order);
});

router.put('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).end();
  await order.update(req.body);
  res.json(order);
});

router.delete('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).end();
  await order.destroy();
  res.status(204).end();
});

module.exports = router;
