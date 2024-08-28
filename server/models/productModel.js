const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  minOrderQuantity: { type: Number, required: true },
  maxOrderQuantity: { type: Number },
  unit: { type: String },
  shipping: { type: String, default: 'No' },
  shippingPrice: { type: Number },
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
  specifications: { type: String },
  productTags: { type: String },
  sku: { type: String },
  supplier: { type: String },
  warranty: { type: String },
  posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'seller', required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;