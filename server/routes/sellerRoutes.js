const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer();

const sellerController = require('../controllers/sellerController'); 

// Routes
router.post('/sellers', upload.fields([
    { name: 'patentDocument', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
  ]), sellerController.createSeller);
router.get('/sellers', sellerController.getSellers);
router.get('/sellers/:id', sellerController.getSellerById);
router.put('/sellers/:id', sellerController.updateSellerById);
router.delete('/sellers/:id', sellerController.deleteSellerById);

module.exports = router;
