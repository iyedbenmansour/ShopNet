import React, { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % product.images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [product.images.length]);

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + product.images.length) % product.images.length);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {product.images.length > 0 && (
        <div className="relative h-64">
          <img
            src={`data:${product.images[currentImageIndex].contentType};base64,${product.images[currentImageIndex].data}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {showControls && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 opacity-75 transition duration-300 ease-in-out"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 opacity-75 transition duration-300 ease-in-out"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
          <button className="bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600 transition duration-300 ease-in-out">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
