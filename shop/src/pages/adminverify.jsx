import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminVerify() {
  const [sellers, setSellers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchSellers() {
      try {
        const response = await axios.get('http://localhost:5000/api/sellers');
        setSellers(response.data);
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    }

    async function fetchVerifications() {
      try {
        const response = await axios.get('http://localhost:5000/api/verify');
        setVerifications(response.data);
      } catch (error) {
        console.error('Error fetching verifications:', error);
      }
    }

    fetchSellers();
    fetchVerifications();
  }, []);

  useEffect(() => {
    if (sellers.length > 0 && verifications.length > 0) {
      const combined = sellers
        .filter(seller => verifications.some(v => v.enterpriseId.toString() === seller._id.toString()))
        .map(seller => {
          const verification = verifications.find(v => v.enterpriseId.toString() === seller._id.toString());
          return {
            ...seller,
            userVerified: verification ? verification.userVerified : false,
            paymentVerified: verification ? verification.paymentVerified : false,
          };
        });
      setCombinedData(combined);
    }
  }, [sellers, verifications]);

  useEffect(() => {
    let filtered = combinedData;
    switch (filter) {
      case 'verified':
        filtered = combinedData.filter(seller => seller.userVerified);
        break;
      case 'notVerified':
        filtered = combinedData.filter(seller => !seller.userVerified);
        break;
      case 'paid':
        filtered = combinedData.filter(seller => seller.paymentVerified);
        break;
      case 'notPaid':
        filtered = combinedData.filter(seller => !seller.paymentVerified);
        break;
      default:
        filtered = combinedData;
    }
    setFilteredData(filtered);
  }, [filter, combinedData]);

  const getVerificationStatus = (isVerified) => (isVerified ? 'Verified' : 'Not Verified');
  const getPaymentStatus = (isPaid) => (isPaid ? 'Paid' : 'Not Paid');

  const handleOpenImagePreview = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    setPreviewImageSrc(url);
    setIsImagePreviewOpen(true);
  };

  const handleCloseImagePreview = () => {
    setIsImagePreviewOpen(false);
    URL.revokeObjectURL(previewImageSrc);
  };

  const updateVerificationStatus = async (enterpriseId, updates) => {
    try {
      const verification = verifications.find(v => v.enterpriseId.toString() === enterpriseId);
      if (!verification) {
        alert('Seller not found for verification update.');
        return;
      }

      await axios.patch(`http://localhost:5000/api/verify/${enterpriseId}`, updates);
      setVerifications(prev => prev.map(v =>
        v.enterpriseId.toString() === enterpriseId ? { ...v, ...updates } : v
      ));
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const toggleVerification = (id, currentStatus) => {
    updateVerificationStatus(id, { userVerified: !currentStatus });
  };

  const togglePaymentVerification = (id, currentStatus) => {
    updateVerificationStatus(id, { paymentVerified: !currentStatus });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-8">Seller Verification Dashboard</h1>
          
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('verified')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${filter === 'verified' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'}`}
            >
              Verified
            </button>
            <button
              onClick={() => setFilter('notVerified')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${filter === 'notVerified' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
            >
              Not Verified
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${filter === 'paid' ? 'bg-green-600 text-white shadow-lg' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilter('notPaid')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${filter === 'notPaid' ? 'bg-yellow-600 text-white shadow-lg' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
            >
              Not Paid
            </button>
            <button
              onClick={() => setFilter('')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${filter === '' ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-4">Profile Picture</th>
                  <th className="p-4">Patent Document</th>
                  <th className="p-4">Enterprise Name</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((seller) => (
                  <tr key={seller._id} className="border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-200">
                    <td className="p-4 text-center">
                      {seller.profilePicture ? (
                        <img
                          src={`data:image/jpeg;base64,${seller.profilePicture}`}
                          alt="Profile"
                          className="w-20 h-20 object-cover rounded-full mx-auto border-4 border-indigo-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center mx-auto">
                          <span className="text-indigo-600 font-bold">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {seller.patentDocument ? (
                        <button
                          onClick={() => handleOpenImagePreview(seller.patentDocument)}
                          className="inline-block"
                        >
                          <img
                            src={`data:image/jpeg;base64,${seller.patentDocument}`}
                            alt="Patent Document"
                            className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200 border-4 border-indigo-200"
                          />
                        </button>
                      ) : (
                        <div className="w-32 h-32 rounded-lg bg-indigo-200 flex items-center justify-center mx-auto">
                          <span className="text-indigo-600 font-bold">No Document</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-800">{seller.enterpriseName}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full ${seller.userVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {getVerificationStatus(seller.userVerified)}
                      </span>
                      <button
                        onClick={() => toggleVerification(seller._id, seller.userVerified)}
                        className={`ml-4 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${seller.userVerified ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      >
                        {seller.userVerified ? 'Unverify' : 'Verify'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full ${seller.paymentVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {getPaymentStatus(seller.paymentVerified)}
                      </span>
                      <button
                        onClick={() => togglePaymentVerification(seller._id, seller.paymentVerified)}
                        className={`ml-4 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${seller.paymentVerified ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      >
                        {seller.paymentVerified ? 'Unpay' : 'Pay'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isImagePreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-screen overflow-auto">
            <button
              onClick={handleCloseImagePreview}
              className="absolute top-4 right-4 text-white bg-red-600 p-2 rounded-full focus:outline-none hover:bg-red-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={previewImageSrc} alt="Document Preview" className="max-w-full rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
}