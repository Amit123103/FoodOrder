import React, { useState } from 'react';

const Menu = ({ menuItems, cart = [], addToCart, removeFromCart, isShopOpen = true, categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filter by category
  const visibleItems = menuItems.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const filterCategories = ['All', ...categories];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-playfair text-5xl font-bold text-brown-dark mb-4">
          Our Home Made Menu
        </h1>
        <p className="text-gray-600 max-w-2xl text-lg">
          Fresh from Lawgate to your table. Hand-picked ingredients prepared with complete home-made care and a touch of sun-drenched garden magic.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        {filterCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
              activeCategory === category 
                ? 'bg-teal-500 text-white border-teal-500' 
                : 'bg-white text-brown-dark border border-gray-200 hover:border-teal-500 hover:text-teal-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {visibleItems.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow border border-gray-100 group ${!item.available ? 'opacity-75' : ''}`}>
            <div className="relative h-48 overflow-hidden bg-cream">
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brown-dark shadow-sm z-10 flex items-center gap-1">
                <span>{item.emoji}</span> {item.category}
              </div>
              {!item.available && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full transform -rotate-12 border-2 border-white shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
              <img 
                src={item.image} 
                alt={item.name} 
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!item.available ? 'grayscale' : ''}`}
              />
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-playfair font-bold text-xl text-brown-dark line-clamp-1">{item.name}</h3>
                <span className="font-bold text-brown-golden ml-2">₹{item.price}</span>
              </div>
              <p className="text-sm text-gray-500 flex-grow mb-6 line-clamp-2">
                {item.description}
              </p>
              
              {isShopOpen ? (
                item.available ? (
                  cart && cart.find(c => c.id === item.id) ? (
                    <div className="w-full flex items-center justify-between bg-green-sage text-white font-bold py-2 px-4 rounded-lg mt-auto">
                      <button 
                        onClick={() => removeFromCart(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        -
                      </button>
                      <span>{cart.find(c => c.id === item.id).quantity} in cart</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full bg-green-dark hover:bg-green-sage text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-auto"
                    >
                      <span>+</span> Add to Cart
                    </button>
                  )
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-auto cursor-not-allowed"
                  >
                    Unavailable
                  </button>
                )
              ) : (
                <button 
                  disabled
                  className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-auto cursor-not-allowed"
                >
                  Shop Closed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {visibleItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No items available in this category currently.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
