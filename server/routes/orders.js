const express = require('express');
const router = express.Router();
const { Order, Customer, Product } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  const { customerId, productId, status, startDate, endDate } = req.query;
  const where = {};
  if (customerId) where.CustomerId = customerId;
  if (productId) where.ProductId = productId;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  const orders = await Order.findAll({
    where,
    include: [Customer, Product]
  });
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
