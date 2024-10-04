const express = require("express");
const sequelize = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const subscriptionRoutes = require("./src/routes/suscriptionRoutes");
const statusRoutes = require("./src/routes/statusRoutes");
const { relations } = require("./src/models/Relations");
const categoriesRoute = require("./src/routes/categoriesRoute");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type']
}))
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/users", userRoutes);  
app.use("/api/products", productRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/categories", categoriesRoute);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(3000,'0.0.0.0', () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

  sequelize.sync({ force: false }) // Usa { force: true } solo en desarrollo para forzar la actualización
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });
