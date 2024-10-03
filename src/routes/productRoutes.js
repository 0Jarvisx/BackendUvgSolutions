const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, uploadImage } = require('../controllers/ProductController');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();
const { s3, GetObjectCommand, getSignedUrl } = require("../config/aws");

router.post('/',createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
