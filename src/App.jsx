import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OwnerLogin from './pages/OwnerLogin';
import OwnerDashboard from './pages/OwnerDashboard';
import { defaultMenuItems } from './data';

function App() {
  // State
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMenu = localStorage.getItem('gvk_menu_v3');
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      setMenuItems(defaultMenuItems);
      localStorage.setItem('gvk_menu_v3', JSON.stringify(defaultMenuItems));
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('gvk_menu_v3', JSON.stringify(menuItems));
      } catch (e) {
        console.error("Storage error:", e);
        if (e.name === 'QuotaExceededError') {
          alert('Failed to save menu! The images you uploaded are taking up too much space. Try using smaller images or deleting some old items.');
        }
      }
    }
  }, [menuItems, isLoaded]);

  // Sync menu across multiple tabs/windows instantly (perfect live updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gvk_menu_v3' && e.newValue) {
        setMenuItems(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actions
  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === item.id);
      if (existing) {
        return prevCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity > 1) {
          return prevCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
        } else {
          return prevCart.filter(i => i.id !== item.id);
        }
      }
      return prevCart;
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Router
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'menu':
        return <Menu menuItems={menuItems} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />;
      case 'checkout':
        return <Checkout cart={cart} cartTotal={cartTotal} setCart={setCart} setCurrentPage={setCurrentPage} />;
      case 'owner_login':
        return <OwnerLogin setIsOwnerLoggedIn={setIsOwnerLoggedIn} setCurrentPage={setCurrentPage} />;
      case 'owner_dashboard':
        return isOwnerLoggedIn ? (
          <OwnerDashboard 
            setIsOwnerLoggedIn={setIsOwnerLoggedIn} 
            setCurrentPage={setCurrentPage}
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
        ) : (
          <OwnerLogin setIsOwnerLoggedIn={setIsOwnerLoggedIn} setCurrentPage={setCurrentPage} />
        );
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center bg-cream font-playfair text-2xl text-brown-golden">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream flex flex-col font-lato text-brown-dark">
      {/* Hide navbar on owner pages for cleaner portal feel, or keep it? The design implies owner login is part of the app. We'll keep Navbar but hide basket if owner dashboard. */}
      {currentPage !== 'owner_dashboard' && currentPage !== 'owner_login' && (
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          cartCount={cartCount} 
        />
      )}
      
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>
      
      {currentPage !== 'owner_dashboard' && currentPage !== 'owner_login' && (
        <Footer setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}

export default App;
