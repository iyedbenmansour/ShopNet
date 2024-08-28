import React from 'react';
import NavBar from '../components/Navbar';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <header className="relative py-16">
        <div className="container mx-auto px-4">
          
          
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Revolutionizing Global B2B Commerce
            </h1>
            <p className="text-xl mb-12">
              Connect with millions of suppliers and buyers worldwide on the premier digital marketplace for business.
            </p>
            <div className="flex items-center max-w-xl mx-auto bg-white rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="What are you searching for?"
                className="flex-grow px-6 py-4 text-gray-800 focus:outline-none"
              />
              <button className="bg-blue-500 text-white px-8 py-4 hover:bg-blue-600 transition duration-300">
                Explore
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ShopNet?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="network"
              title="Vast Business Network"
              description="Access a global marketplace with millions of product offerings and verified suppliers."
            />
            <FeatureCard
              icon="shield"
              title="Secure Transactions"
              description="Enjoy protected payments and verified quality assurance from order to delivery."
            />
            <FeatureCard
              icon="tools"
              title="Comprehensive Platform"
              description="Manage your entire trading process from product search to order fulfillment in one place."
            />
            <FeatureCard
              icon="chart"
              title="Personalized Experience"
              description="Benefit from tailored perks, including exclusive deals and enhanced support for your business growth."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const iconMap = {
    network: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    shield: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    tools: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    chart: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };

  return (
    <>
<NavBar />
    <div className="bg-blue-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
      <div className="bg-blue-700 rounded-full w-16 h-16 flex items-center justify-center mb-6">
        {iconMap[icon]}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-blue-200">{description}</p>
    </div>
    </>
  );
};

export default Home;