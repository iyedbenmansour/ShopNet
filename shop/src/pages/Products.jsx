import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {jwtDecode} from 'jwt-decode';
import Navbar from '../components/Navbar';

export default function AddProduct() {
  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'construction', label: 'Construction' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'office-supplies', label: 'Office Supplies' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'education', label: 'Education' },
    { value: 'pet-supplies', label: 'Pet Supplies' },
    { value: 'energy', label: 'Energy' },
    { value: 'telecommunications', label: 'Telecommunications' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'security', label: 'Security' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'chemicals', label: 'Chemicals' },
    { value: 'machinery', label: 'Machinery' },
    { value: 'metals', label: 'Metals' },
    { value: 'plastics', label: 'Plastics' },
    { value: 'cleaning-supplies', label: 'Cleaning Supplies' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'financial-services', label: 'Financial Services' },
    { value: 'legal-services', label: 'Legal Services' },
    { value: 'consulting', label: 'Consulting' },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const posterId = decoded.id;

      setProduct((prevProduct) => ({
        ...prevProduct,
        posterId: posterId,
      }));
    }
  }, []);

  const [product, setProduct] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    pricePerUnit: '',
    minOrderQuantity: '',
    maxOrderQuantity: '',
    unit: '',
    shipping: 'No',
    shippingPrice: '',
    images: [],
    specifications: '',
    productTags: '',
    sku: '',
    supplier: '',
    warranty: '',
    posterId: '',
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const fileArray = Array.from(files);
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...fileArray],
      }));

      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...imageUrls]);
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (key === 'images') {
        product.images.forEach((image) => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, product[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product submitted:', result);
        window.location.href = '/profile';
      } else {
        const errorData = await response.json();
        console.error('Failed to submit product:', errorData.message);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <>
    <Navbar />  
    <div className="container mx-auto p-4 lg:p-8 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Product</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-1">Product Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={product.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="sku" className="block text-gray-700 text-sm font-semibold mb-1">SKU</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-semibold mb-1">Category</label>
              <Select
                options={categories}
                onChange={handleCategoryChange}
                className="w-full"
                placeholder="Select a category"
                isClearable
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-gray-700 text-sm font-semibold mb-1">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="pricePerUnit" className="block text-gray-700 text-sm font-semibold mb-1">Price per Unit</label>
              <input
                type="text"
                id="pricePerUnit"
                name="pricePerUnit"
                value={product.pricePerUnit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="minOrderQuantity" className="block text-gray-700 text-sm font-semibold mb-1">Min Order Quantity</label>
              <input
                type="number"
                id="minOrderQuantity"
                name="minOrderQuantity"
                value={product.minOrderQuantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="maxOrderQuantity" className="block text-gray-700 text-sm font-semibold mb-1">Max Order Quantity</label>
              <input
                type="number"
                id="maxOrderQuantity"
                name="maxOrderQuantity"
                value={product.maxOrderQuantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-gray-700 text-sm font-semibold mb-1">Unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={product.unit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="shipping" className="block text-gray-700 text-sm font-semibold mb-1">Shipping</label>
              <select
                id="shipping"
                name="shipping"
                value={product.shipping}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {product.shipping === 'Yes' && (
              <div>
                <label htmlFor="shippingPrice" className="block text-gray-700 text-sm font-semibold mb-1">Shipping Price</label>
                <input
                  type="text"
                  id="shippingPrice"
                  name="shippingPrice"
                  value={product.shippingPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0.00"
                />
              </div>
            )}
            <div>
              <label htmlFor="supplier" className="block text-gray-700 text-sm font-semibold mb-1">Supplier</label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={product.supplier}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="warranty" className="block text-gray-700 text-sm font-semibold mb-1">Warranty</label>
              <input
                type="text"
                id="warranty"
                name="warranty"
                value={product.warranty}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1 year"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-1">Product Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>

          <div>
            <label htmlFor="specifications" className="block text-gray-700 text-sm font-semibold mb-1">Specifications</label>
            <textarea
              id="specifications"
              name="specifications"
              value={product.specifications}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="productTags" className="block text-gray-700 text-sm font-semibold mb-1">Product Tags (comma separated)</label>
            <input
              type="text"
              id="productTags"
              name="productTags"
              value={product.productTags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-gray-700 text-sm font-semibold mb-1">Product Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 file:border-0 file:bg-gray-100 file:py-1 file:px-2 file:rounded-lg file:text-gray-700 file:font-semibold file:text-sm hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {imagePreviews.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Image Previews</h2>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-md hover:bg-blue-700 transition duration-300"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}