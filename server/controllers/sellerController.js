const Seller = require('../models/SellerModel'); 


// Create a new seller
exports.createSeller = async (req, res) => {
  try {
    const { enterpriseName, email, password, phoneNumber } = req.body;
    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].buffer : null;
    const patentDocument = req.files['patentDocument'] ? req.files['patentDocument'][0].buffer : null;

    const newSeller = new Seller({
      enterpriseName,
      email,
      password,
      phoneNumber,
      profilePicture,
      patentDocument,
      role: 'seller',
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller created successfully', seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create seller', error });
  }
};
/// Get all sellers
exports.getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();

    // Convert buffers to base64 strings
    const sellersWithBase64 = sellers.map(seller => {
      return {
        ...seller._doc,
        profilePicture: seller.profilePicture
          ? seller.profilePicture.toString('base64')
          : null,
        patentDocument: seller.patentDocument
          ? seller.patentDocument.toString('base64')
          : null,
      };
    });

    res.status(200).json(sellersWithBase64);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve sellers', error });
  }
};



// Get a seller by ID
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    
    // Convert profilePicture buffer to base64 string for easier display in JSON
    const sellerData = seller.toObject();
    if (sellerData.profilePicture) {
      sellerData.profilePicture = sellerData.profilePicture.toString('base64');
    }
    
    res.status(200).json(sellerData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve seller', error });
  }
};

// Update a seller by ID
exports.updateSellerById = async (req, res) => {
  try {
    const { enterpriseName, email, password, phoneNumber, patentDocument, profilePicture } = req.body;
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      { enterpriseName, email, password, phoneNumber, patentDocument, profilePicture },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller updated successfully', seller: updatedSeller });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update seller', error });
  }
};

// Delete a seller by ID
exports.deleteSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete seller', error });
  }
};
