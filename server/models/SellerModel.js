
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  enterpriseName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  patentDocument: { type: Buffer },
  profilePicture: { type: Buffer },
  role: { type: String, default: 'seller' }
}, { timestamps: true }); ;

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;