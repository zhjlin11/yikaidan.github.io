const { Sequelize, DataTypes } = require('sequelize');
const createCustomer = require('./customer');
const createProduct = require('./product');
const createOrder = require('./order');

const DATABASE_URL = process.env.MYSQL_URI || 'mysql://user:pass@localhost:3306/app_db';
const sequelize = new Sequelize(DATABASE_URL);

const Customer = createCustomer(sequelize, DataTypes);
const Product = createProduct(sequelize, DataTypes);
const Order = createOrder(sequelize, DataTypes);

Customer.hasMany(Order);
Order.belongsTo(Customer);
Product.hasMany(Order);
Order.belongsTo(Product);

module.exports = { sequelize, Customer, Product, Order };
