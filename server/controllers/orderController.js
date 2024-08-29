const Order = require('../models/orderModel');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, totalPrice, pricePerUnit, message, shipping, address } = req.body;
    const order = new Order({ userId, productId, quantity, totalPrice, pricePerUnit, message, shipping, address });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get orders by buyer
exports.getOrdersByBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.buyerId });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get orders by seller
exports.getOrdersBySeller = async (req, res) => {
  try {
    const orders = await Order.find({ 'productId.sellerId': req.params.sellerId });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, totalPrice, pricePerUnit, message, shipping, address } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { userId, productId, quantity, totalPrice, pricePerUnit, message, shipping, address }, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};