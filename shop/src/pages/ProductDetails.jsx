import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import NavBar from '../components/Navbar';
import Facture from '../components/facture';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [shipping, setShipping] = useState('No');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setQuantity(response.data.minOrderQuantity);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleStartOrder = () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    const decodedToken = jwtDecode(token);
    const total = product.pricePerUnit * quantity + (shipping === 'Yes' ? product.shippingPrice : 0);
    const orderData = {
      userId: decodedToken.id,
      productId: product._id,
      productTitle: product.title,
      quantity,
      totalPrice: total,
      pricePerUnit: product.pricePerUnit,
      message,
      shipping,
      address: shipping === 'Yes' ? address : null,
    };

    setOrderDetails(orderData);
  };

  const handleOrderConfirmed = () => {
    setOrderDetails(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-red-600">Product not found</div>
      </div>
    );
  }

  if (orderDetails) {
    return (
      <Facture orderDetails={orderDetails} onConfirm={handleOrderConfirmed} />
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image Gallery */}
            <div className="order-2 lg:order-1">
              <div className="mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`data:${product.images[mainImage].contentType};base64,${product.images[mainImage].data}`}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {product.images && product.images.map((image, index) => (
                  <img
                    key={index}
                    src={`data:${image.contentType};base64,${image.data}`}
                    alt={`${product.title} - ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${index === mainImage ? 'border-2 border-blue-500 shadow-lg' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setMainImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details and Order Form */}
            <div className="order-1 lg:order-2">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.title}</h1>
              <p className="text-lg text-gray-700 mb-6">{product.description}</p>
              
              {/* Pricing and Order Information */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-semibold text-blue-600">${product.pricePerUnit.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">per {product.unit || 'unit'}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Minimum Order: {product.minOrderQuantity} {product.unit || 'units'}</p>
                <p className="text-sm text-gray-600 mb-4">Maximum Order: {product.maxOrderQuantity || 'Not specified'} {product.unit || 'units'}</p>
                <div className="flex items-center justify-between">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center">
                    <button onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - 1))} className="bg-blue-500 text-white px-3 py-2 rounded-l-md">-</button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minOrderQuantity, parseInt(e.target.value)))}
                      className="w-20 text-center border-t border-b border-blue-500 py-2"
                    />
                    <button onClick={() => setQuantity(quantity + 1)} className="bg-blue-500 text-white px-3 py-2 rounded-r-md">+</button>
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="mb-6">
                <label htmlFor="shipping" className="block text-sm font-medium text-gray-700 mb-2">Shipping:</label>
                <select
                  id="shipping"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                {shipping === 'Yes' && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country:</label>
                        <input
                          type="text"
                          id="country"
                          value={address.country}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          className="w-full p-2 border rounded-lg mt-1"
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street:</label>
                        <input
                          type="text"
                          id="street"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          className="w-full p-2 border rounded-lg mt-1"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
                        <input
                          type="text"
                          id="city"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full p-2 border rounded-lg mt-1"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State:</label>
                        <input
                          type="text"
                          id="state"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full p-2 border rounded-lg mt-1"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code:</label>
                        <input
                          type="text"
                          id="zip"
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          className="w-full p-2 border rounded-lg mt-1"
                          placeholder="ZIP Code"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message to Seller */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message to Seller:</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Write your message here..."
                  rows="4"
                />
              </div>

              {/* Total Price */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-xl font-semibold text-blue-700">Total Price: ${(product.pricePerUnit * quantity + (shipping === 'Yes' ? product.shippingPrice : 0)).toFixed(2)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleStartOrder}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
                >
                  Start Order
                </button>
                <button
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          {/* Additional Product Information */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Specifications</h2>
                <p className="text-gray-700">{product.specifications || "No specifications available"}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tags: <span className="font-semibold">{product.productTags}</span></p>
                    <p className="text-sm text-gray-600">Created: <span className="font-semibold">{new Date(product.createdAt).toLocaleDateString()}</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated: <span className="font-semibold">{new Date(product.updatedAt).toLocaleDateString()}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}