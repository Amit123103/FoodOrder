import React from 'react';
import { MapPin, Clock, Leaf, Truck, Utensils, Phone, Star } from 'lucide-react';

const Home = ({ setCurrentPage, feedbacks = [] }) => {
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
            Ayush Food Junction
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md">
            100% Home Made Food. Nourishing the community with completely home-cooked meals crafted from the finest seasonal ingredients grown right here in the Valley.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setCurrentPage('menu')}
              className="bg-orange-primary hover:bg-orange-600 text-white font-bold py-3 px-8 rounded transition-colors shadow-lg"
            >
              Order Now
            </button>
            <button onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })} className="border-2 border-white text-white hover:bg-white hover:text-brown-dark font-bold py-3 px-8 rounded transition-colors shadow-lg">
              View Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-10 md:p-16 flex-1 flex flex-col justify-center">
            <h2 className="font-playfair text-4xl font-bold text-brown-golden mb-6">
              Our Philosophy
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              At Ayush Food Junction, transparency isn't just a buzzword—it's our foundation. We completely make home-cooked meals. Every herb, vegetable, and grain is sourced directly from Lawgate's local farmers or harvested from our own kitchen garden, ensuring that only the freshest home-made ingredients make it to your plate.
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
                <span className="text-xs font-bold text-brown-dark">Completely Home Made</span>
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

      {/* Customer Reviews Section */}
      {feedbacks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-brown-dark mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600">Real feedback from real food lovers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.slice(0, 6).map((fb) => (
              <div key={fb.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={18} 
                      fill={star <= fb.rating ? "#F59E0B" : "none"} 
                      color={star <= fb.rating ? "#F59E0B" : "#D1D5DB"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic flex-grow mb-4">
                  "{fb.text || "Delicious home-made food! Highly recommended!"}"
                </p>
                <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                  <p className="font-bold text-brown-dark">{fb.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(fb.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visit Section */}
      <section className="bg-green-sage text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="font-playfair text-4xl font-bold mb-4">
                  Visit & Contact
                </h2>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-orange-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-xl">Lawgate and Green Valley Centre</h3>
                      <p className="text-gray-300">Front of Micasa PG</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-orange-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-xl">Contact Number</h3>
                      <p className="text-gray-300">+91 97795 09769</p>
                    </div>
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
                    <p className="text-gray-300">5:00 PM – 6:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <a 
                href="https://maps.app.goo.gl/kNY7Xi7ddHGMQcYW7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-white p-2 rounded-xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer relative"
              >
                <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden relative">
                  <iframe 
                    src="https://maps.google.com/maps?q=Sahil+PG,+Bahri+House,+Law+Gate,+Phagwara&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Live Location"
                  ></iframe>
                  {/* Invisible overlay so the entire card remains clickable to open the actual Maps link */}
                  <div className="absolute inset-0 bg-transparent z-10"></div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow-lg z-20">
                  <p className="font-playfair font-bold text-brown-dark">Ayush Food Junction</p>
                  <p className="text-xs text-green-dark">Click to open full Google Maps</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
