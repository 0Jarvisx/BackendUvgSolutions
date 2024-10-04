const express = require('express');
const { createOrder, updateOrderStatus, getOrders } = require('../controllers/OrderController');
const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/status', updateOrderStatus);

module.exports = router;
