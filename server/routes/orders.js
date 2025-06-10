const express = require('express');
const router = express.Router();
const { Order, Customer, Product } = require('../models');

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
