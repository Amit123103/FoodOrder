'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext({});

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('foodie_wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem('foodie_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add to wishlist
  const addToWishlist = useCallback((food) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => item.id === food.id)) {
        toast.error('Already in wishlist');
        return prev;
      }
      toast.success(`${food.name} added to wishlist`);
      return [...prev, food];
    });
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback((foodId) => {
    setWishlistItems((prev) => {
      const item = prev.find((i) => i.id === foodId);
      if (item) {
        toast.success(`${item.name} removed from wishlist`);
      }
      return prev.filter((item) => item.id !== foodId);
    });
  }, []);

  // Toggle wishlist
  const toggleWishlist = useCallback((food) => {
    const isInWishlist = wishlistItems.some((item) => item.id === food.id);
    if (isInWishlist) {
      removeFromWishlist(food.id);
    } else {
      addToWishlist(food);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((foodId) => {
    return wishlistItems.some((item) => item.id === foodId);
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default WishlistContext;
