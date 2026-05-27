import React, { useState } from 'react';

const OwnerLogin = ({ setIsOwnerLoggedIn, setCurrentPage }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'owner123') {
      setIsOwnerLoggedIn(true);
      setCurrentPage('owner_dashboard');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-cream min-h-[calc(100vh-80px)] px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-brown-golden mb-2">
            Ayush Kitchen
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
