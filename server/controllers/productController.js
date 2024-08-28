const Product = require('../models/productModel');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
      const { title, description, category, brand, pricePerUnit, minOrderQuantity, maxOrderQuantity, unit, shipping, shippingPrice, specifications, productTags, sku, supplier, warranty, posterId } = req.body;
  
      // Handle multiple image uploads
      const images = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));
  
      const product = new Product({
        title,
        description,
        category,
        brand,
        pricePerUnit: parseFloat(pricePerUnit),
        minOrderQuantity: parseInt(minOrderQuantity),
        maxOrderQuantity: maxOrderQuantity ? parseInt(maxOrderQuantity) : undefined,
        unit,
        shipping,
        shippingPrice: shippingPrice ? parseFloat(shippingPrice) : undefined,
        specifications,
        productTags,
        sku,
        supplier,
        warranty,
        posterId,
        images,
      });
  
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ message: error.message });
    }
  };

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        // Map through products to include image data
        const productsWithImages = products.map(product => {
            const images = product.images.map(image => ({
                data: image.data.toString('base64'),
                contentType: image.contentType
            }));
            return {
                ...product._doc,
                images
            };
        });

        res.status(200).json(productsWithImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get products by poster ID
exports.getProductsByPosterId = async (req, res) => {
    try {
        const { posterId } = req.params;

        if (!posterId) {
            return res.status(400).json({ message: 'Poster ID is required' });
        }

        const products = await Product.find({ posterId });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this poster ID' });
        }

        const productsWithImages = products.map(product => {
            const images = product.images.map(image => ({
                data: image.data.toString('base64'),
                contentType: image.contentType
            }));
            return {
                ...product._doc,
                images
            };
        });

        res.status(200).json(productsWithImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update product by ID
exports.updateProduct = async (req, res) => {
    try {
        const updates = req.body;

        if (req.files && req.files.length > 0) {
            // Handle updated images as Buffers
            updates.images = req.files.map(file => ({
                data: file.buffer,
                contentType: file.mimetype,
            }));
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
