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
      const combined = sellers.map(seller => {
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Seller Verification Status</h1>
      
      <div className="mb-4">
        <button
          onClick={() => setFilter('verified')}
          className={`mr-2 p-2 ${filter === 'verified' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Verified
        </button>
        <button
          onClick={() => setFilter('notVerified')}
          className={`mr-2 p-2 ${filter === 'notVerified' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Not Verified
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`mr-2 p-2 ${filter === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Paid
        </button>
        <button
          onClick={() => setFilter('notPaid')}
          className={`mr-2 p-2 ${filter === 'notPaid' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Not Paid
        </button>
        <button
          onClick={() => setFilter('')}
          className={`p-2 ${filter === '' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 border-b">Profile Picture</th>
            <th className="p-4 border-b">Patent Document</th>
            <th className="p-4 border-b">Enterprise Name</th>
            <th className="p-4 border-b">Verification Status</th>
            <th className="p-4 border-b">Payment Status</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((seller) => (
            <tr key={seller._id} className="text-center">
              <td className="p-4 border-b">
                {seller.profilePicture ? (
                  <img
                    src={`data:image/jpeg;base64,${seller.profilePicture}`}
                    alt="Profile"
                    className="w-16 h-16 object-cover rounded-full mx-auto"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </td>
              <td className="p-4 border-b">
                {seller.patentDocument ? (
                  <button
                    onClick={() => handleOpenImagePreview(seller.patentDocument)}
                    className="inline-block"
                  >
                    <img
                      src={`data:image/jpeg;base64,${seller.patentDocument}`}
                      alt="Patent Document"
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                    />
                  </button>
                ) : (
                  <span className="text-gray-500">No Document</span>
                )}
              </td>
              <td className="p-4 border-b">{seller.enterpriseName}</td>
              <td className="p-4 border-b">
                {getVerificationStatus(seller.userVerified)}
                <button
                  onClick={() => toggleVerification(seller._id, seller.userVerified)}
                  className="ml-4 p-2 bg-blue-500 text-white rounded"
                >
                  {seller.userVerified ? 'Unverify' : 'Verify'}
                </button>
              </td>
              <td className="p-4 border-b">
                {getPaymentStatus(seller.paymentVerified)}
                <button
                  onClick={() => togglePaymentVerification(seller._id, seller.paymentVerified)}
                  className="ml-4 p-2 bg-green-500 text-white rounded"
                >
                  {seller.paymentVerified ? 'Unpay' : 'Pay'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isImagePreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            <button
              onClick={handleCloseImagePreview}
              className="absolute top-2 right-2 text-white bg-red-600 p-2 rounded-full focus:outline-none"
            >
              X
            </button>
            <img src={previewImageSrc} alt="Document Preview" className="max-w-full max-h-screen" />
          </div>
        </div>
      )}
    </div>
  );
}
