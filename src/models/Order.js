const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  user_id: DataTypes.INTEGER,
  status_id: DataTypes.INTEGER,
  total: DataTypes.FLOAT,
});


module.exports = Order;
