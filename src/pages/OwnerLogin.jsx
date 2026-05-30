import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const OwnerLogin = ({ setIsOwnerLoggedIn, setCurrentPage }) => {
  const [step, setStep] = useState('mobile');
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Hardcoded, locked Admin Number
  const adminMobile = '+919779509769';

  useEffect(() => {
    // Initialize the invisible reCAPTCHA for Firebase Phone Auth
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, adminMobile, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err) {
      console.error(err);
      setError('Failed to send SMS. Make sure Phone Auth is enabled in Firebase and you are using a testing number locally.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    try {
      await confirmationResult.confirm(otpInput);
      setIsOwnerLoggedIn(true);
      setCurrentPage('owner_dashboard');
    } catch (err) {
      console.error(err);
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
        
        {/* Invisible reCAPTCHA container required by Firebase */}
        <div id="recaptcha-container"></div>

        {step === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase">
                Admin Mobile Number
              </label>
              <input 
                type="text" 
                value={adminMobile}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed transition-colors font-bold tracking-wide"
              />
              <p className="text-xs text-gray-400 mt-2">The admin number is locked for security.</p>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-brown-golden hover:bg-brown-dark text-white font-bold py-3 rounded-lg transition-colors shadow-md"
            >
              Send Secure OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                Secure OTP sent to <span className="font-bold">{adminMobile}</span>
              </p>
              <button 
                type="button" 
                onClick={() => { setStep('mobile'); setOtpInput(''); setError(''); }}
                className="text-teal-600 hover:text-teal-700 text-sm font-bold mt-1"
              >
                Go Back
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase text-center">
                Enter 6-Digit OTP
              </label>
              <input 
                type="text" 
                maxLength="6"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="000000" 
                className="w-full border border-gray-200 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors text-center text-3xl font-bold tracking-[0.5em]"
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
