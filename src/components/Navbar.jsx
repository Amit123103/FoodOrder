import React from 'react';
import { ShoppingBasket } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, cartCount }) => {
  return (
    <nav className="bg-cream sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex-shrink-0 cursor-pointer max-w-[50%]" 
            onClick={() => setCurrentPage('home')}
          >
            <h1 className="font-playfair italic font-bold text-xl md:text-3xl text-brown-golden leading-tight">
              Ayush Food Junction
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-8">
            <div className="flex space-x-3 md:space-x-8 text-sm md:text-base">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`text-brown-dark hover:text-brown-golden transition-colors ${currentPage === 'home' ? 'border-b-2 border-brown-golden font-bold' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('menu')}
                className={`text-brown-dark hover:text-brown-golden transition-colors ${currentPage === 'menu' ? 'border-b-2 border-brown-golden font-bold' : ''}`}
              >
                Menu
              </button>
            </div>
            
            <button 
              onClick={() => setCurrentPage('checkout')}
              className="relative p-2 text-brown-dark hover:text-brown-golden transition-colors"
            >
              <ShoppingBasket className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
