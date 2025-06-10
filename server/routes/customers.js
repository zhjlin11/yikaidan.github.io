const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../authMiddleware');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const customers = await Customer.findAll();
    res.json(customers);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).end();
    res.json(customer);
  })
);

router.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  })
);

router.put(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).end();
    await customer.update(req.body);
    res.json(customer);
  })
);

router.delete(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).end();
    await customer.destroy();
    res.status(204).end();
  })
);

module.exports = router;
