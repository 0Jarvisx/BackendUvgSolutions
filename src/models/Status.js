const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');

const Status = sequelize.define('Status', {
  name: DataTypes.STRING,
});


module.exports = Status;
