import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OwnerLogin from './pages/OwnerLogin';
import OwnerDashboard from './pages/OwnerDashboard';
import { defaultMenuItems } from './data';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  // State
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [categories, setCategories] = useState(['Starters', 'Main Course', 'Drinks', 'Desserts', 'Snacks', 'Ice Creams', 'Groceries', 'Cigarettes']);

  // Load real-time data from Firebase Firestore
  useEffect(() => {
    // Listen to menuItems collection
    const unsubMenu = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      const items = [];
      snapshot.forEach(doc => {
        if (doc.id !== '_store_settings_' && doc.id !== '_store_categories_') {
          items.push({ id: doc.id, ...doc.data() });
        }
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

    // Listen to store settings
    const unsubSettings = onSnapshot(doc(db, 'menuItems', '_store_settings_'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.isDeliveryAvailable !== undefined) {
          setIsDeliveryAvailable(data.isDeliveryAvailable);
        }
        if (data.isShopOpen !== undefined) {
          setIsShopOpen(data.isShopOpen);
        }
      } else {
        // Create the doc if it doesn't exist
        setDoc(doc(db, 'menuItems', '_store_settings_'), { isDeliveryAvailable: true, isShopOpen: true });
      }
    });

    // Listen to store categories
    const unsubCategories = onSnapshot(doc(db, 'menuItems', '_store_categories_'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.list && Array.isArray(data.list)) {
          setCategories(data.list);
        }
      } else {
        // Create the doc if it doesn't exist
        setDoc(doc(db, 'menuItems', '_store_categories_'), { 
          list: ['Starters', 'Main Course', 'Drinks', 'Desserts', 'Snacks', 'Ice Creams', 'Groceries', 'Cigarettes']
        });
      }
    });

    // One-time wipe and seed for Egg Curry
    const wipeAndSeed = async () => {
      try {
        const { getDocs, deleteDoc, addDoc, collection, doc } = await import('firebase/firestore');
        const snapshot = await getDocs(collection(db, 'menuItems'));
        
        let hasEggCurry = false;
        snapshot.forEach(d => {
          if (d.data().name && d.data().name.toLowerCase() === 'egg curry') hasEggCurry = true;
        });

        if (!hasEggCurry) {
          // Delete all
          const deletePromises = [];
          snapshot.forEach(d => {
            if (d.id !== '_store_settings_' && d.id !== '_store_categories_') {
              deletePromises.push(deleteDoc(doc(db, 'menuItems', d.id)));
            }
          });
          await Promise.all(deletePromises);
          
          // Add Egg Curry
          await addDoc(collection(db, 'menuItems'), {
            name: 'Egg Curry',
            category: 'Main Course',
            price: 150,
            description: 'Delicious homestyle egg curry with rich, spiced gravy.',
            available: true,
            emoji: '🥚',
            image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=500',
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Wipe and seed failed:", err);
      }
    };
    wipeAndSeed();

    setIsLoaded(true);

    return () => {
      unsubMenu();
      unsubFeedbacks();
      unsubSettings();
      unsubCategories();
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
        return <Menu menuItems={menuItems} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} isShopOpen={isShopOpen} categories={categories} />;
      case 'checkout':
        return <Checkout cart={cart} cartTotal={cartTotal} setCart={setCart} setCurrentPage={setCurrentPage} setFeedbacks={setFeedbacks} isDeliveryAvailable={isDeliveryAvailable} isShopOpen={isShopOpen} />;
      case 'owner_login':
        return <OwnerLogin setIsOwnerLoggedIn={setIsOwnerLoggedIn} setCurrentPage={setCurrentPage} />;
      case 'owner_dashboard':
        return isOwnerLoggedIn ? (
          <OwnerDashboard 
            setIsOwnerLoggedIn={setIsOwnerLoggedIn} 
            setCurrentPage={setCurrentPage}
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            isDeliveryAvailable={isDeliveryAvailable}
            isShopOpen={isShopOpen}
            categories={categories}
          />
        ) : (
          <OwnerLogin setIsOwnerLoggedIn={setIsOwnerLoggedIn} setCurrentPage={setCurrentPage} />
        );
      default:
        return <Home setCurrentPage={setCurrentPage} feedbacks={feedbacks} />;
    }
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center bg-cream font-playfair text-2xl text-brown-golden">Loading...</div>;

  const isCustomerPage = currentPage !== 'owner_dashboard' && currentPage !== 'owner_login';

  return (
    <div className="min-h-screen bg-cream flex flex-col font-lato text-brown-dark">
      {isCustomerPage && (
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          cartCount={cartCount} 
        />
      )}
      
      {isCustomerPage && !isShopOpen && (
        <div className="bg-red-600 text-white text-center py-3 font-bold shadow-md relative z-10 animate-pulse">
          ⚠️ Today Shop Closed. We are not accepting orders at this time.
        </div>
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
