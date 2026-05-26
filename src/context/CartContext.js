'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DELIVERY_FEE, COUPON_CODES } from '@/utils/constants';
import toast from 'react-hot-toast';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('foodie_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('foodie_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('foodie_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback((food) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === food.id);
      if (existingItem) {
        toast.success(`Updated ${food.name} quantity`);
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${food.name} added to cart`);
      return [...prev, { ...food, quantity: 1 }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((foodId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === foodId);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      return prev.filter((item) => item.id !== foodId);
    });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === foodId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('foodie_coupon');
    toast.success('Cart cleared');
  }, []);

  // Apply coupon
  const applyCoupon = useCallback((code) => {
    const coupon = COUPON_CODES[code.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ code: code.toUpperCase(), ...coupon });
      localStorage.setItem('foodie_coupon', JSON.stringify({ code: code.toUpperCase(), ...coupon }));
      toast.success(`Coupon applied: ${coupon.description}`);
      return true;
    }
    toast.error('Invalid coupon code');
    return false;
  }, []);

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode('');
    localStorage.removeItem('foodie_coupon');
    toast.success('Coupon removed');
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let discount = 0;
  let deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === 'flat') {
      discount = appliedCoupon.discount;
    } else if (appliedCoupon.type === 'delivery') {
      deliveryFee = 0;
    }
  }

  const total = subtotal + deliveryFee - discount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        appliedCoupon,
        couponCode,
        setCouponCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
