const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Order } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

// Generate a simulated prepay order
router.post(
  '/pay/preorder',
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'order not found' });

    // In a real app here you would call WeChat unified order API
    const prepayId = 'prepay_' + Date.now();

    await order.update({ prepayId, payStatus: 'prepay' });

    // Simulate params required by wx.requestPayment
    const timeStamp = String(Math.floor(Date.now() / 1000));
    const nonceStr = crypto.randomBytes(16).toString('hex');
    const paySign = crypto
      .createHash('md5')
      .update(prepayId + timeStamp + nonceStr)
      .digest('hex');

    res.json({ prepayId, timeStamp, nonceStr, paySign });
  })
);

// Simulated WeChat Pay callback handler
router.post(
  '/pay/callback',
  asyncHandler(async (req, res) => {
    console.log('Received WeChat Pay callback:', req.body);
    const { orderId, signature } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).end();

    // Here you would verify the signature using WeChat's algorithm
    const expected = crypto
      .createHash('md5')
      .update(order.prepayId)
      .digest('hex');
    if (signature !== expected) return res.status(400).end();

    await order.update({ payStatus: 'paid', status: 'paid' });
    res.send('success');
  })
);

module.exports = router;
