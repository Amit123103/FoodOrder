import React, { useState } from 'react';
import { Lock, MessageCircle, Star } from 'lucide-react';
import { collection, addDoc, doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
const OWNER_WHATSAPP_NUMBER = "919779509769"; // <-- Change this to your actual WhatsApp number

const Checkout = ({ cart, cartTotal, setCart, setCurrentPage, setFeedbacks }) => {
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    address: ''
  });

  const deliveryFee = 40;
  const finalTotal = cartTotal > 0 ? cartTotal + deliveryFee : 0;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getNextOrderNumber = async () => {
    try {
      const counterRef = doc(db, 'counters', 'dailyOrder');
      
      const { newCount, istTimeStr } = await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(counterRef);
        
        const now = new Date();
        const istTimeStr = now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
        const istDate = new Date(istTimeStr);
        
        // Business day shifts at 6:00 AM IST.
        let businessDay = new Date(istDate);
        if (businessDay.getHours() < 6) {
          businessDay.setDate(businessDay.getDate() - 1);
        }
        const businessDateStr = `${businessDay.getFullYear()}-${businessDay.getMonth() + 1}-${businessDay.getDate()}`;
        
        let newCount = 1;
        if (!sfDoc.exists()) {
          transaction.set(counterRef, { count: 1, businessDateStr });
        } else {
          const data = sfDoc.data();
          if (data.businessDateStr === businessDateStr) {
            newCount = (data.count || 0) + 1;
          } else {
            newCount = 1; // Reset for new day
          }
          transaction.update(counterRef, { count: newCount, businessDateStr });
        }
        return { newCount, istTimeStr };
      });
      return { orderNumber: newCount, orderTime: istTimeStr };
    } catch (error) {
      console.error("Counter transaction failed: ", error);
      const now = new Date();
      return { 
        orderNumber: 'N/A', 
        orderTime: now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}) 
      };
    }
  };

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!formData.name || !formData.mobile || !formData.location || !formData.address) {
      alert("Please fill in all delivery details.");
      return;
    }

    setIsProcessingOrder(true);
    
    // Get Atomic Order Number and IST Time
    const { orderNumber, orderTime } = await getNextOrderNumber();

    const itemsText = cart.map(item =>
      `- ${item.name} x${item.quantity} ₹${item.price * item.quantity}`
    ).join('%0A');

    const message = `🍽️ *New Order - Ayush Food Junction*%0A*Order #:* ${orderNumber}%0A*Time:* ${orderTime} (IST)%0A*Customer:* ${formData.name}%0A*Mobile:* ${formData.mobile}%0A*Location:* ${formData.location}%0A*Address:* ${formData.address}%0A*Items:*%0A${itemsText}%0A*Subtotal:* ₹${cartTotal}%0A*Delivery:* ₹${deliveryFee}%0A*Total:* ₹${finalTotal}`;
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Clear the cart and show feedback screen
    setCart([]);
    setIsProcessingOrder(false);
    setIsOrderSubmitted(true);
  };

  const handleFeedbackSubmit = async () => {
    try {
      await addDoc(collection(db, 'feedbacks'), {
        name: formData.name || 'Anonymous Guest',
        rating,
        text: feedbackText,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
    setCurrentPage('home');
  };

  const handleSkipFeedback = () => {
    setCurrentPage('home');
  };

  if (isOrderSubmitted) {
    return (
      <div className="w-full pb-20 pt-12 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="font-playfair text-3xl font-bold text-brown-dark mb-2">
            Order Sent!
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for ordering from Ayush Food Junction. We'd love to hear about your experience!
          </p>
          
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Rate your experience</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    fill={star <= rating ? "#F59E0B" : "none"} 
                    color={star <= rating ? "#F59E0B" : "#D1D5DB"} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what you loved... (Optional)"
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white resize-none"
              rows="3"
            ></textarea>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleSkipFeedback}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Skip
            </button>
            <button 
              onClick={handleFeedbackSubmit}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      {/* Hero Banner */}
      <section
        className="w-full h-64 md:h-80 flex items-center justify-center text-center px-4"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/assets/images/checkout-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
            Finalize Your Order
          </h1>
          <p className="text-gray-200 text-lg font-lato">
            Almost there! Freshness is just a message away.
          </p>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left Column: Delivery Details */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-playfair text-2xl font-bold text-green-dark mb-6 border-b border-gray-100 pb-4">
                Delivery Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase">Location</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors text-brown-dark"
                    >
                      <option value="">Select Location</option>
                      <option value="Green Valley">Green Valley</option>
                      <option value="Lawgate">Lawgate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase">Address / Landmark</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Building Name, House No, or nearby landmark..."
                    rows="3"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-cream rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-28">
              <h2 className="font-playfair text-2xl font-bold text-green-dark mb-6">
                Order Summary
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Your cart is empty.
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 hide-scrollbar">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-brown-dark">
                        <div className="flex-1 pr-4">
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-brown-golden">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <span className="font-playfair text-2xl font-bold text-brown-dark">Total</span>
                    <span className="font-bold text-3xl text-brown-golden">₹{finalTotal}</span>
                  </div>

                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={isProcessingOrder}
                    className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-3 text-lg ${isProcessingOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-primary hover:bg-orange-600'}`}
                  >
                    <MessageCircle size={24} />
                    {isProcessingOrder ? 'Generating Order #...' : 'Send Order on WhatsApp'}
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock size={12} />
                    <span>Securely finalized at Ayush</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
