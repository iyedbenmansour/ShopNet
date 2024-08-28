
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkAuthToken = () => {
      const token = sessionStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuthToken();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDisconnect = () => {
    sessionStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/aboutus' },
    { name: 'Catalogue', href: '/catalogue' },
    ...(isLoggedIn
      ? [
          { name: 'Profile', href: '/profile' },
          { name: 'Disconnect', href: '/login', onClick: handleDisconnect },
        ]
      : [
          { name: 'Login', href: '/login' },
          { name: 'Register', href: '/register' },
        ]),
  ];

  const textColor = isHomePage && !isScrolled ? 'text-white' : 'text-gray-800';
  const hoverTextColor = isHomePage && !isScrolled ? 'hover:text-blue-200' : 'hover:text-blue-500';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
</div>            <span className={`text-xl font-bold ${textColor}`}>Shopnet</span>
          </Link>
          <ul className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`text-sm font-medium ${textColor} ${hoverTextColor} transition-colors duration-300`}
                  onClick={item.onClick}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`${textColor} focus:outline-none transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>
      <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col space-y-4 p-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="block py-2 px-4 text-gray-800 hover:bg-blue-500 hover:text-white rounded transition-colors duration-300"
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  toggleMenu();
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;