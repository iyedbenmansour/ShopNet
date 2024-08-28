const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Create a new verification
router.post('/verify', verificationController.createVerification);

// Get all verifications
router.get('/verify', verificationController.getAllVerifications);

// Get verifications by enterpriseId
router.get('/verify/:sellerId', verificationController.getVerificationByEnterpriseId);

// Update a verification by ID (patch)
router.patch('/verify/:enterpriseId', verificationController.updateVerification);

// Delete a verification by ID
router.delete('/verify/:id', verificationController.deleteVerification);

module.exports = router;
