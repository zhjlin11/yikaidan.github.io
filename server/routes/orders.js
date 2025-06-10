const express = require('express');
const router = express.Router();
const { Order, Customer, Product } = require('../models');
const generateSeal = require('../utils/sealGenerator');
const generatePayCode = require('../utils/qrcode');
const asyncHandler = require('../utils/asyncHandler');

// List all orders with associated customer and product
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const orders = await Order.findAll({ include: [Customer, Product] });
    res.json(orders);
  })
);

// Get single order by id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, { include: [Customer, Product] });
    if (!order) return res.status(404).end();
    res.json(order);
  })
);

// Create a new order and attach seal/QR code
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { CustomerId, ProductId } = req.body;
    const customer = await Customer.findByPk(CustomerId);
    const product = await Product.findByPk(ProductId);
    if (!customer || !product) {
      return res.status(400).json({ error: 'Invalid CustomerId or ProductId' });
    }

    const order = await Order.create(req.body);
    const seal = generateSeal(`Order ${order.id}`);
    const payCode = await generatePayCode(`PAY:${order.id}`);
    await order.update({ seal, payCode });
    res.status(201).json(order);
  })
);

// Update an order
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).end();
    const { CustomerId, ProductId } = req.body;
    if (CustomerId) {
      const customer = await Customer.findByPk(CustomerId);
      if (!customer) {
        return res.status(400).json({ error: 'Invalid CustomerId' });
      }
    }
    if (ProductId) {
      const product = await Product.findByPk(ProductId);
      if (!product) {
        return res.status(400).json({ error: 'Invalid ProductId' });
      }
    }

    await order.update(req.body);
    res.json(order);
  })
);

// Delete an order
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).end();
    await order.destroy();
    res.status(204).end();
  })
);

module.exports = router;
