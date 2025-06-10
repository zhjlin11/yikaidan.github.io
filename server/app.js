const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const wechatRoutes = require('./routes/wechat');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/wechat', wechatRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
