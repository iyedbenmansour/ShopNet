import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import NavBar from '../components/Navbar';
import ProductCard from '../components/productcard';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [noProducts, setNoProducts] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        const userId = decodedToken.id;
        const role = decodedToken.role;

        setUserRole(role);

        const apiUrl = `http://localhost:5000/api/${role}s/${userId}`;

        axios.get(apiUrl)
          .then(response => {
            setUserData(response.data);
            setLoading(false);
          })
          .catch(err => {
            setError('Failed to fetch user data');
            setLoading(false);
          });

        if (role === 'seller') {
          axios.get(`http://localhost:5000/api/products/poster/${userId}`)
            .then(response => {
              const fetchedProducts = response.data;
              setProducts(fetchedProducts);
              setNoProducts(fetchedProducts.length === 0);
            })
            .catch(err => {
              if (err.response && err.response.status === 404) {
                setNoProducts(true);
              } else {
                setError('Failed to fetch products');
                setNoProducts(false);
              }
            });

          axios.get(`http://localhost:5000/api/verify/${userId}`)
            .then(response => {
              const verificationData = response.data[0] || {};
              setVerificationStatus(verificationData);
            })
            .catch(err => {
              setError('Failed to fetch verification status');
            });
        }
      } catch (err) {
        setError('Invalid token');
        setLoading(false);
      }
    } else {
      setError('No auth token found');
      setLoading(false);
    }
  }, []);

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

  const canAddProduct = verificationStatus?.userVerified && verificationStatus?.paymentVerified;

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-12 mt-16">
        {userData && (
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                {userData.profilePicture ? (
                  <img
                    src={`data:image/jpeg;base64,${userData.profilePicture}`}
                    alt="Profile"
                    className="h-64 w-full object-cover md:w-64 transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="h-64 w-full md:w-64 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-8 md:flex-grow flex justify-between">
                <div>
                  <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold mb-2">
                    {userRole === 'seller' ? 'Seller Profile' : 'Buyer Profile'}
                  </div>
                  <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                    {userData.name || userData.enterpriseName}
                  </h1>
                  <p className="text-xl text-gray-700 mb-2">{userData.email}</p>
                  <p className="text-lg text-gray-600 mb-4">{userData.phoneNumber}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Member since: {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {userRole === 'seller' && (
                  <div className="mt-4 space-y-2 text-right">
                    <div className="flex flex-col items-end space-y-2">
                      {verificationStatus ? (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${
                          verificationStatus.userVerified 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {verificationStatus.userVerified ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Not Verified
                            </>
                          )}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-800">
                          Verification Status: Loading...
                        </span>
                      )}
                      {verificationStatus?.paymentVerified ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Subscribed
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Not Subscribed
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {userRole === 'seller' && (
          <div className="mt-12">
            <button
              className={`py-4 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform ${
                canAddProduct
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              onClick={() => canAddProduct && (window.location.href = '/add-product')}
              disabled={!canAddProduct}
            >
              Add New Product
            </button>
            {!canAddProduct && (
              <p className="mt-4 text-red-600 text-center">
                You need to be verified and subscribed to add products.
              </p>
            )}
          </div>
        )}

        {userRole === 'seller' && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Products</h2>
            {noProducts ? (
              <p className="text-center text-xl text-gray-600 bg-gray-100 p-8 rounded-lg shadow">
                No products found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.length > 0 ? (
                  products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <p className="text-center text-xl text-gray-600 bg-gray-100 p-8 rounded-lg shadow col-span-full">
                    No products available.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;