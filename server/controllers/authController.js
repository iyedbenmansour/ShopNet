// controllers/authController.js
const jwt = require('jsonwebtoken');
const Buyer = require('../models/BuyerModel'); // Assuming Buyer model
const Seller = require('../models/SellerModel'); // Assuming Seller model

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;
    if (req.body.role === 'buyer') {
      user = await Buyer.findOne({ email });
    } else if (req.body.role === 'seller') {
      user = await Seller.findOne({ email });
    }

    if (user && password === user.password) { 
      const token = jwt.sign({
        id: user._id,
        role: user.role,
        nom: user.name
      }, process.env.SECRET_KEY , { expiresIn: '1h' });

      res.json({
        token,
        message: "User authenticated successfully"
      });
    } else {
      res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  login
};
