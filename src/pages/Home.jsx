import React from 'react';
import { MapPin, Clock, Leaf, Truck, Utensils } from 'lucide-react';

const Home = ({ setCurrentPage }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative w-full h-[600px] flex items-center justify-start px-4 sm:px-8 lg:px-16"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/assets/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-3xl text-white z-10">
          <div className="inline-block bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
            FRESH FROM LAWGATE
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
            Ayush Kitchen
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md">
            Nourishing the community with artisanal, farm-to-table meals crafted from the finest seasonal ingredients grown right here in the Valley.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setCurrentPage('menu')}
              className="bg-orange-primary hover:bg-orange-600 text-white font-bold py-3 px-8 rounded transition-colors shadow-lg"
            >
              Order Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-brown-dark font-bold py-3 px-8 rounded transition-colors shadow-lg">
              View Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-10 md:p-16 flex-1 flex flex-col justify-center">
            <h2 className="font-playfair text-4xl font-bold text-brown-golden mb-6">
              Our Philosophy
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              At Ayush Kitchen, transparency isn't just a buzzword—it's our foundation. We believe that food tastes better when you know where it comes from. Every herb, vegetable, and grain is sourced directly from Lawgate's local farmers or harvested from our own kitchen garden, ensuring that only the freshest ingredients make it to your plate.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-green-dark mb-3">
                  <Leaf size={24} />
                </div>
                <span className="text-xs font-bold text-brown-dark">100% Organic</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-green-dark mb-3">
                  <Truck size={24} />
                </div>
                <span className="text-xs font-bold text-brown-dark">Daily Harvest</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-green-dark mb-3">
                  <Utensils size={24} />
                </div>
                <span className="text-xs font-bold text-brown-dark">Artisanal Craft</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] md:min-h-full bg-gray-200">
            <img 
              src="/assets/images/philosophy.png" 
              alt="Fresh ingredients" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Visit Section */}
      <section className="bg-green-sage text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="font-playfair text-4xl font-bold mb-4">
                  Visit Our Kitchen
                </h2>
                <div className="flex items-start gap-3">
                  <MapPin className="text-orange-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl">Lawgate Area</h3>
                    <p className="text-gray-300">The heart of the valley, right where the fresh air meets the fields.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-4">
                  Kitchen Hours
                </h2>
                <div className="flex items-start gap-3">
                  <Clock className="text-orange-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl">Open Daily</h3>
                    <p className="text-gray-300">9:00 AM – 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="bg-white p-2 rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="/assets/images/map.png" 
                  alt="Valley Map Illustration" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow-lg">
                  <p className="font-playfair font-bold text-brown-dark">Ayush Kitchen</p>
                  <p className="text-xs text-green-dark">Freshness starts here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
