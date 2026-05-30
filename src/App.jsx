import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OwnerLogin from './pages/OwnerLogin';
import OwnerDashboard from './pages/OwnerDashboard';
import { defaultMenuItems } from './data';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  // State
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  // Load real-time data from Firebase Firestore
  useEffect(() => {
    // Listen to menuItems collection
    const unsubMenu = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      const items = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      
      // Optional: if database is completely empty on first run, you might want to manually 
      // add default data via the admin panel. For now, we just set whatever is in DB.
      setMenuItems(items);
    });

    // Listen to feedbacks collection
    const unsubFeedbacks = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
      const fb = [];
      snapshot.forEach(doc => {
        fb.push({ id: doc.id, ...doc.data() });
      });
      // Sort newest first
      fb.sort((a, b) => new Date(b.date) - new Date(a.date));
      setFeedbacks(fb);
    });

    setIsLoaded(true);

    return () => {
      unsubMenu();
      unsubFeedbacks();
    };
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
        return <Home setCurrentPage={setCurrentPage} feedbacks={feedbacks} />;
      case 'menu':
        return <Menu menuItems={menuItems} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />;
      case 'checkout':
        return <Checkout cart={cart} cartTotal={cartTotal} setCart={setCart} setCurrentPage={setCurrentPage} setFeedbacks={setFeedbacks} />;
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
        return <Home setCurrentPage={setCurrentPage} feedbacks={feedbacks} />;
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
