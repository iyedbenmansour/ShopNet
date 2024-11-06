import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';

const Dashboard = ({ sellerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sellerId) {
      axios.get(`https://shopnet-iov2.onrender.com/api/orders/seller/${sellerId}`)
        .then(response => {
          setOrders(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching orders:', err); 
          setError('Failed to fetch orders');
          setLoading(false);
        });
    }
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-center text-red-600 text-xl font-semibold bg-red-100 p-4 rounded-lg shadow-md">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-12 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Order Dashboard</h2>
        {orders.length === 0 ? (
          <p className="text-center text-xl text-gray-600 bg-gray-100 p-8 rounded-lg shadow">
            No orders found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Order ID: {order._id}</h3>
                <p className="text-gray-700">Product ID: {order.productId}</p>
                <p className="text-gray-700">Quantity: {order.quantity}</p>
                <p className="text-gray-700">Total Price: ${order.totalPrice.toFixed(2)}</p>
                <p className="text-gray-700">Price Per Unit: ${order.pricePerUnit.toFixed(2)}</p>
                <p className="text-gray-700">Shipping: {order.shipping}</p>
                <p className="text-gray-700">Address: {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                <p className="text-gray-700 text-sm">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 