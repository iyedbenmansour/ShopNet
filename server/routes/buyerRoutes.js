const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer();

const { createBuyer, getAllBuyers, getBuyerById, updateBuyerById, deleteBuyerById } = require('../controllers/buyerController');

// POST route to create a new buyer
router.post('/buyers', upload.single('profilePicture'), createBuyer);

// GET route to retrieve all buyers
router.get('/buyers', getAllBuyers);

// GET route to retrieve a specific buyer by ID
router.get('/buyers/:id', getBuyerById);

// PATCH route to update a specific buyer by ID
router.patch('/buyers/:id', updateBuyerById);

// DELETE route to delete a specific buyer by ID
router.delete('/buyers/:id', deleteBuyerById);

module.exports = router;
