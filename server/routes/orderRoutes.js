const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);
router.get('/orders/buyer/:buyerId', orderController.getOrdersByBuyer);
router.get('/orders/seller/:sellerId', orderController.getOrdersBySeller);
router.patch('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;