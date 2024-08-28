import React from 'react';
import NavBar from '../components/Navbar';
export default function About() {
  return (
    <>
    <NavBar />
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen mt-16">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-blue-800 text-center mb-12">
          About ShopNet
        </h1>
        
        <section className="mb-16">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6">Our Vision</h2>
          <p className="text-blue-900 text-lg mb-4">
            At ShopNet, we envision a world where businesses of all sizes can seamlessly connect, trade, and thrive on a global scale. Our mission is to break down barriers in international commerce, making it accessible, efficient, and secure for everyone.
          </p>
          <p className="text-blue-900 text-lg">
            We're not just another e-commerce platform; we're revolutionizing the way B2B transactions happen across borders, cultures, and industries.
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Journey</h2>
            <p className="text-blue-900 mb-4">
              Founded in 2015 by a team of international trade experts and tech innovators, ShopNet was born out of a simple yet powerful idea: to create a digital silk road for the modern era.
            </p>
            <p className="text-blue-900 mb-4">
              We started with a small team of 10 in a cramped office in Silicon Valley. Today, we're a global company with over 1,000 employees across 15 offices worldwide, serving millions of businesses in more than 220 countries and regions.
            </p>
            <p className="text-blue-900">
              Our growth story is one of relentless innovation, customer-centric approach, and a deep commitment to fostering global trade relationships.
            </p>
          </div>
          <div className="bg-blue-600 rounded-lg shadow-xl p-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">ShopNet by Numbers</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-4xl font-bold mr-4">2M+</span>
                <span className="text-xl">Active businesses on our platform</span>
              </li>
              <li className="flex items-center">
                <span className="text-4xl font-bold mr-4">220+</span>
                <span className="text-xl">Countries and regions served</span>
              </li>
              <li className="flex items-center">
                <span className="text-4xl font-bold mr-4">$100B+</span>
                <span className="text-xl">Annual trade volume facilitated</span>
              </li>
              <li className="flex items-center">
                <span className="text-4xl font-bold mr-4">50M+</span>
                <span className="text-xl">Products listed on our platform</span>
              </li>
              <li className="flex items-center">
                <span className="text-4xl font-bold mr-4">15</span>
                <span className="text-xl">Global offices</span>
              </li>
            </ul>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-700 mb-3">AI-Powered Matching</h3>
              <p className="text-blue-900">
                Our proprietary AI algorithm analyzes millions of data points to connect buyers with the most suitable suppliers, considering factors like product quality, pricing, shipping capabilities, and past performance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-700 mb-3">Blockchain Security</h3>
              <p className="text-blue-900">
                We utilize advanced blockchain technology to ensure secure, transparent, and tamper-proof transactions, giving our users peace of mind in every deal they make.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-700 mb-3">Real-Time Analytics</h3>
              <p className="text-blue-900">
                Our platform provides businesses with powerful analytics tools, offering real-time insights into market trends, competitor analysis, and personalized business opportunities.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6">Our Commitment</h2>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Empowering Businesses</h3>
            <p className="text-blue-900 mb-4">
              We're committed to leveling the playing field in global trade. Whether you're a small artisan workshop or a large multinational corporation, ShopNet provides you with the tools and opportunities to compete on a global scale.
            </p>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Sustainable Trade</h3>
            <p className="text-blue-900 mb-4">
              We believe in responsible business practices. Our platform actively promotes and supports sustainable and ethical trade, encouraging businesses to adopt environmentally friendly and socially responsible practices.
            </p>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Continuous Innovation</h3>
            <p className="text-blue-900">
              The world of commerce is ever-evolving, and so are we. We're constantly innovating and improving our platform to meet the changing needs of global businesses and stay ahead of industry trends.
            </p>
          </div>
        </section>
        
        <section className="text-center">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6">Join the ShopNet Community</h2>
          <p className="text-blue-900 mb-8 max-w-2xl mx-auto">
            Whether you're looking to expand your business globally, find reliable suppliers, or tap into new markets, ShopNet is your gateway to unlimited possibilities in the world of B2B e-commerce.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Start Your Global Journey
          </button>
        </section>
      </div>
    </div>
    </>
  );
}