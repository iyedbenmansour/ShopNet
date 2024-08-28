const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

// Configure Multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes for products
router.post('/products', upload.array('images'), productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products/poster/:posterId', productController.getProductsByPosterId);
router.patch('/products/:id', upload.array('images'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
