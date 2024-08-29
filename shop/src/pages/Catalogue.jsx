import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        const initialIndices = response.data.reduce((acc, product) => {
          acc[product._id] = 0;
          return acc;
        }, {});
        setCurrentImageIndices(initialIndices);

        const uniqueCategories = ['All', ...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hoveredProductId === null && products.length > 0) {
        setCurrentImageIndices(prevIndices => {
          const updatedIndices = { ...prevIndices };
          products.forEach(product => {
            updatedIndices[product._id] = (prevIndices[product._id] + 1) % (product.images?.length || 1);
          });
          return updatedIndices;
        });
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [products, hoveredProductId]);

  const handlePrevImage = (e, productId, images) => {
    e.stopPropagation();
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [productId]: (prevIndices[productId] - 1 + images.length) % images.length
    }));
  };

  const handleNextImage = (e, productId, images) => {
    e.stopPropagation();
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [productId]: (prevIndices[productId] + 1) % images.length
    }));
  };

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    (product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">Product Catalogue</h1>
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/4">
            <select
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
              onMouseEnter={() => setHoveredProductId(product._id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="relative h-64 bg-gray-200">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`data:${product.images[currentImageIndices[product._id]].contentType};base64,${product.images[currentImageIndices[product._id]].data}`} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                {hoveredProductId === product._id && product.images && product.images.length > 1 && (
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    <button 
                      onClick={(e) => handlePrevImage(e, product._id, product.images)}
                      className="bg-white bg-opacity-75 text-gray-800 p-2 rounded-full shadow hover:bg-opacity-100 transition duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleNextImage(e, product._id, product.images)}
                      className="bg-white bg-opacity-75 text-gray-800 p-2 rounded-full shadow hover:bg-opacity-100 transition duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.title}</h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">{product.brand}</span>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">{product.category}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-2xl font-bold text-orange-600">${product.pricePerUnit.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">per {product.unit || 'unit'}</p>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Min. Order: {product.minOrderQuantity} {product.unit || 'units'}
                </div>
                {product.shipping === 'Yes' && (
                  <div className="flex items-center text-green-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    <span className="text-sm">
                      Shipping: ${product.shippingPrice?.toFixed(2) || 'Price varies'}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 text-sm font-medium flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}