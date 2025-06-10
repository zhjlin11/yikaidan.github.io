const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../authMiddleware');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).end();
    res.json(product);
  })
);

router.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  })
);

router.put(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).end();
    await product.update(req.body);
    res.json(product);
  })
);

router.delete(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).end();
    await product.destroy();
    res.status(204).end();
  })
);

module.exports = router;
