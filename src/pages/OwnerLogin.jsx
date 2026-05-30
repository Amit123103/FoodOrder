import React, { useState } from 'react';

const OwnerLogin = ({ setIsOwnerLoggedIn, setCurrentPage }) => {
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('+91 9779509769');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobile.trim() || mobile.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError('');
    // Generate secure 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep('otp');
    // Simulate sending SMS via browser alert
    setTimeout(() => {
      alert(`📱 MOCK SMS:\n\nYour Ayush Food Junction Owner OTP is: ${code}`);
    }, 500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      setIsOwnerLoggedIn(true);
      setCurrentPage('owner_dashboard');
    } else {
      setError('Invalid OTP code. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-cream min-h-[calc(100vh-80px)] px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-brown-golden mb-2">
            Ayush Food Junction
          </h1>
          <p className="text-gray-500 font-lato">Owner Portal Login</p>
        </div>
        
        {step === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase">
                Registered Mobile Number
              </label>
              <input 
                type="text" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 XXXXX XXXXX" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors text-brown-dark font-bold tracking-wide"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-brown-golden hover:bg-brown-dark text-white font-bold py-3 rounded-lg transition-colors shadow-md"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                OTP sent to <span className="font-bold">{mobile}</span>
              </p>
              <button 
                type="button" 
                onClick={() => { setStep('mobile'); setOtpInput(''); setError(''); }}
                className="text-teal-600 hover:text-teal-700 text-sm font-bold mt-1"
              >
                Change Number
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase text-center">
                Enter 4-Digit OTP
              </label>
              <input 
                type="text" 
                maxLength="4"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="0000" 
                className="w-full border border-gray-200 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors text-center text-3xl font-bold tracking-[1em]"
              />
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
            >
              Verify & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OwnerLogin;
