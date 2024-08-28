const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePicture: { type: Buffer }, 
  role: { type: String, default: 'buyer' }
}, { timestamps: true }); 

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
