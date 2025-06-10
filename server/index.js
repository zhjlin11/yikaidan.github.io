const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./models');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const wechatRoutes = require('./routes/wechat');

const app = express();
app.use(bodyParser.json());

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/wechat', wechatRoutes);

const port = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
  }
}

start();
