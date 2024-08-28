const Buyer = require('../models/BuyerModel');

// Create a new buyer
exports.createBuyer = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const profilePicture = req.file ? req.file.buffer : null;

    const newBuyer = new Buyer({
      name,
      email,
      password,
      phoneNumber,
      profilePicture,
      role: 'buyer',
    });

    await newBuyer.save();
    res.status(201).json({ message: 'Buyer created successfully', buyer: newBuyer });
  } catch (error) {
    console.error('Error creating buyer:', error);
    res.status(500).json({ message: 'Error creating buyer', error: error.message });
  }
};

// Controller function to get all buyers
exports.getAllBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find();
    const buyersWithProfilePic = buyers.map(buyer => ({
      ...buyer._doc,
      profilePicture: buyer.profilePicture ? buyer.profilePicture.toString('base64') : null
    }));
    res.status(200).json(buyersWithProfilePic);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({
      message: 'Error fetching buyers',
      error: error.message
    });
  }
};

// Controller function to get a single buyer by ID
exports.getBuyerById = async (req, res) => {
  const { id } = req.params;

  try {
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    const buyerWithProfilePic = {
      ...buyer._doc,
      profilePicture: buyer.profilePicture ? buyer.profilePicture.toString('base64') : null
    };
    res.status(200).json(buyerWithProfilePic);
  } catch (error) {
    console.error('Error fetching buyer:', error);
    res.status(500).json({
      message: 'Error fetching buyer',
      error: error.message
    });
  }
};
// Controller function to update a buyer by ID
exports.updateBuyerById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const buyer = await Buyer.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.status(200).json({
      message: 'Buyer updated successfully',
      buyer
    });
  } catch (error) {
    console.error('Error updating buyer:', error);
    res.status(500).json({
      message: 'Error updating buyer',
      error: error.message
    });
  }
};

// Controller function to delete a buyer by ID
exports.deleteBuyerById = async (req, res) => {
  const { id } = req.params;

  try {
    const buyer = await Buyer.findByIdAndDelete(id);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.status(200).json({
      message: 'Buyer deleted successfully',
      buyer
    });
  } catch (error) {
    console.error('Error deleting buyer:', error);
    res.status(500).json({
      message: 'Error deleting buyer',
      error: error.message
    });
  }
};
