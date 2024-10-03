const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  category_id: DataTypes.INTEGER,
  stock: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
});


module.exports = Product;
