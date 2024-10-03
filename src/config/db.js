const { Sequelize } = require("sequelize");
require('dotenv').config();
const namedb = process.env.RDS_NAME;
const hostname = process.env.RDS_HOSTNAME;
const user = process.env.RDS_USERNAME;
const type = process.env.RDS_TYPE;
const password = process.env.RDS_PASSWORD;
const port = parseInt(process.env.RDS_PORT);

const sequelize = new Sequelize(namedb, user, password, {
  host: hostname,
  dialect: type,
  port: port,                 // Asegúrate de usar el puerto correcto (3306 para MySQL)
  logging: false,             // Opcional, deshabilita el logging si no lo necesitas
  pool: {                     // Opcional, ajusta el pool de conexiones si es necesario
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    connectTimeout: 60000, // Aumenta el tiempo de espera a 60 segundos
  },
});

module.exports = sequelize;