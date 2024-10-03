const express = require('express');
const { getStatus } = require('../controllers/StatusController');
const router = express.Router();


router.get('/', getStatus);

module.exports = router;