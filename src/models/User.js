const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,     
  },
  password: DataTypes.STRING,
  rol: DataTypes.STRING,
});
module.exports = User;
