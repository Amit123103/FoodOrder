import React from 'react';

const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="bg-white py-12 mt-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="font-playfair font-bold text-2xl text-brown-golden mb-4">
              Ayush Kitchen
            </h2>
            <p className="text-gray-600 text-sm">
              © 2024 Ayush Kitchen. Fresh from Lawgate to your table. Handcrafted with love.
            </p>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-sm tracking-wider text-green-dark mb-4 uppercase">
              Contact & Visit
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Address: Lawgate Area</li>
              <li>Hours: 9:00 AM - 10:00 PM Daily</li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-sm tracking-wider text-green-dark mb-4 uppercase">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-brown-golden underline">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('menu')} className="hover:text-brown-golden underline">
                  Our Menu
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('owner_login')} className="hover:text-brown-golden underline">
                  Owner Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
