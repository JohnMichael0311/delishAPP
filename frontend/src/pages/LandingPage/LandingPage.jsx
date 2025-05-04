
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './LandingPage.css';
import Search from '../../components/Search/Search'; // Adjust path if necessary

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Order food & groceries. Discover the best restaurants. Delish it!
          </h1>

          {/* Centered Search Section */}
          <div className="searchSection">
            <Search
              searchRoute="/search/"
              defaultRoute="/tag/All"
              placeholder="Search for food..."
              margin="20px auto"
            />
          </div>
        </div>
      </header>

      {/* Cards Section */}
      <section className="services grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        <div className="card">
          {/* Link wrapper around the image */}
          <Link to="/tag/All" className="block">
            <img
              src="/FoodDelivery.png"
              alt="Food Delivery"
              className="w-1/2 mx-auto mb-4"
            />
          </Link>
          <h3 className="text-xl font-semibold mb-2">Food Delivery</h3>
        </div>
      </section>

      {/* Divider Section */}
      <div className="divider"></div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Delish. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;