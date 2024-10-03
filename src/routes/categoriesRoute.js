const express = require('express');
const { getCategories } = require('../controllers/CategoriesController');
const router = express.Router();


router.get('/', getCategories);

module.exports = router;