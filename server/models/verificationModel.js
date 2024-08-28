const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  enterpriseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'seller',  
    required: true,
  },
  userVerified: {
    type: Boolean,
    required: true,
    default: false,  
  },
  paymentVerified: {
    type: Boolean,
    required: true,
    default: false,  
  }
}, {
  timestamps: true, 
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
