const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderDetail = sequelize.define('OrderDetail', {
  order_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  subtotal: DataTypes.FLOAT,
});

module.exports = OrderDetail;
