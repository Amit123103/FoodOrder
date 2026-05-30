import React, { useState } from 'react';

const OwnerLogin = ({ setIsOwnerLoggedIn, setCurrentPage }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Securely hash the input password so the raw password never appears in the source code
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Hash of the target password
      const targetHash = 'e52f4f1b4a687f91996a5d4ff6822a23ca5e8c72a63b412c4864756423953aa4';
      
      if (hashHex === targetHash) {
        setIsOwnerLoggedIn(true);
        setCurrentPage('owner_dashboard');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred');
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
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-brown-dark tracking-wider mb-2 uppercase">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter owner password" 
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-cream focus:bg-white transition-colors"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full bg-brown-golden hover:bg-brown-dark text-white font-bold py-3 rounded-lg transition-colors shadow-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
