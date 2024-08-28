const Verification = require('../models/verificationModel');
const Seller = require('../models/SellerModel');


// Create a new verification record
exports.createVerification = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the seller by email and password
    const seller = await Seller.findOne({ email, password });
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Extract sellerId from the seller document
    const sellerId = seller._id;

    // Check if a verification record already exists for this seller
    const existingVerification = await Verification.findOne({ enterpriseId: sellerId });

    if (existingVerification) {
      // If a verification record already exists, just return a success response
      return res.status(200).json({ message: 'Verification record already exists' });
    }

    // Create a new verification record
    const verification = new Verification({
      enterpriseId: sellerId,
      userVerified: false, // default value
      paymentVerified: false // default value
    });

    const savedVerification = await verification.save();
    res.status(201).json(savedVerification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get all verification records
exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find();
    res.status(200).json(verifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get verification records by enterpriseId
exports.getVerificationByEnterpriseId = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Find verification records for the seller
    const verifications = await Verification.find({ enterpriseId: sellerId });

    res.status(200).json(verifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a verification record by ID (patch)

exports.updateVerification = async (req, res) => {
  try {
    // Find the verification record by enterpriseId
    const updatedVerification = await Verification.findOneAndUpdate(
      { enterpriseId: req.params.enterpriseId }, // Filter by enterpriseId
      req.body, // Data to update
      { new: true } // Return the updated document
    );

    if (!updatedVerification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.status(200).json(updatedVerification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a verification record by ID
exports.deleteVerification = async (req, res) => {
  try {
    const deletedVerification = await Verification.findByIdAndDelete(req.params.id);

    if (!deletedVerification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.status(200).json({ message: 'Verification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
