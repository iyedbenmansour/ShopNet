import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Facture({ orderDetails, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [productDetails, setProductDetails] = useState({});
  const [sellerDetails, setSellerDetails] = useState({});
  const [buyerDetails, setBuyerDetails] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      if (orderDetails && orderDetails.productId && orderDetails.userId) {
        try {
          const productResponse = await axios.get(`http://localhost:5000/api/products/${orderDetails.productId}`);
          const product = productResponse.data;
          setProductName(product.title);
          setProductDetails(product);

          const sellerResponse = await axios.get(`http://localhost:5000/api/sellers/${product.posterId}`);
          setSellerName(sellerResponse.data.enterpriseName);
          setSellerDetails(sellerResponse.data);

          const buyerResponse = await axios.get(`http://localhost:5000/api/buyers/${orderDetails.userId}`);
          setBuyerDetails(buyerResponse.data);
        } catch (error) {
          console.error('Error fetching details:', error);
        }
      }
    };

    fetchDetails();
  }, [orderDetails]);

  const handleConfirm = async () => {
    try {
      await axios.post('http://localhost:5000/api/orders', orderDetails);
      setConfirmed(true);
      onConfirm();
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  if (!orderDetails) {
    return <div>No order details available.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Invoice</h1>
          <p className="mt-2 text-blue-100">Order #{orderDetails.orderId || 'N/A'}</p>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between mb-12">
            <div className="mb-6 md:mb-0 bg-gray-50 p-6 rounded-lg shadow-md w-full md:w-5/12">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Seller</h2>
              <p className="text-gray-700 font-medium text-lg mb-2">{sellerName || 'Loading...'}</p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {sellerDetails.email || 'Loading...'}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Phone:</span> {sellerDetails.phoneNumber || 'Loading...'}
              </p>
              {sellerDetails.address && (
                <p className="text-gray-600">
                  <span className="font-semibold">Address:</span> {sellerDetails.address}
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full md:w-5/12">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Buyer</h2>
              <p className="text-gray-700 font-medium text-lg mb-2">{buyerDetails.name || 'Loading...'}</p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {buyerDetails.email || 'Loading...'}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Phone:</span> {buyerDetails.phoneNumber || 'Loading...'}
              </p>
              {orderDetails.address && (
                <p className="text-gray-600">
                  <span className="font-semibold">Address:</span> {orderDetails.address.street}, {orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zip}, {orderDetails.address.country}
                </p>
              )}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Details</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Quantity</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4">{productName || 'Loading...'}</td>
                  <td className="py-4 px-4">{orderDetails.quantity}</td>
                  <td className="py-4 px-4">${productDetails.pricePerUnit?.toFixed(2) || 'Loading...'}</td>
                  <td className="py-4 px-4 font-medium">${orderDetails.totalPrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
              {orderDetails.address ? (
                <div className="text-gray-600">
                  <p>{orderDetails.address.street}</p>
                  <p>{orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zip}</p>
                  <p>{orderDetails.address.country}</p>
                </div>
              ) : (
                <p className="text-gray-600">No shipping address provided</p>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
              <table className="text-right">
                <tbody className="text-gray-600">
                  <tr>
                    <td className="pr-4 py-2">Subtotal:</td>
                    <td className="font-medium">${orderDetails.totalPrice.toFixed(2)}</td>
                  </tr>
                  {productDetails.shipping === 'Yes' && (
                    <tr>
                      <td className="pr-4 py-2">Shipping:</td>
                      <td className="font-medium">${productDetails.shippingPrice?.toFixed(2) || 'Loading...'}</td>
                    </tr>
                  )}
                  <tr className="text-lg font-bold text-gray-800">
                    <td className="pr-4 py-2">Total:</td>
                    <td>${(orderDetails.totalPrice + (productDetails.shippingPrice || 0)).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {confirmed ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
              <p className="font-bold">Order Confirmed</p>
              <p>Your order has been successfully confirmed and processed.</p>
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 w-full text-lg font-semibold"
            >
              Confirm Order
            </button>
          )}
        </div>

        <div className="bg-gray-50 px-8 py-6 text-sm text-gray-600">
          <p className="mb-2">Thank you for your business. For any questions, please contact our support team.</p>
          <p>Terms & Conditions apply. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}