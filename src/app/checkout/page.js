'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Phone, User, FileText, Navigation, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { createOrder } from '@/firebase/firestore';
import { buildOrderMessage, sendToWhatsApp } from '@/utils/whatsapp';
import { formatPrice, generateOrderId, isValidPhone } from '@/utils/helpers';
import { fadeInUp } from '@/styles/animations';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, subtotal, deliveryFee, discount, total, clearCart } = useCart();
  const { location, loading: locationLoading, getLocation } = useGeolocation();

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: '',
    address: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to place an order');
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    setSubmitting(true);

    try {
      const orderId = generateOrderId();

      const orderData = {
        orderId,
        userId: user.uid,
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        deliveryFee,
        discount,
        totalPrice: total,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        mapLink: location?.mapLink || null,
      };

      // Save order to Firestore
      await createOrder(orderData);

      // Build and send WhatsApp message
      const message = buildOrderMessage(orderData);
      sendToWhatsApp(message);

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white mb-3">Sign In Required</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-8">Please sign in to proceed with checkout</p>
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold shadow-xl"
          >
            Sign In
          </motion.button>
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white mb-3">Cart is Empty</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-8">Add some items before checkout</p>
        <Link href="/menu">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold shadow-xl">
            Browse Menu
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-white mb-8">
          <span className="gradient-text">Checkout</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 space-y-5">
            <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-2">Delivery Details</h3>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  required
                  maxLength={10}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full delivery address"
                  required
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Live Location (Optional)
              </label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={getLocation}
                disabled={locationLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 text-secondary-600 dark:text-secondary-400 rounded-xl text-sm font-medium hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors disabled:opacity-50"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    {location ? 'Location Captured ✓' : 'Get My Current Location'}
                  </>
                )}
              </motion.button>
              {location && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                >
                  <a
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 dark:text-green-400 hover:underline break-all"
                  >
                    📍 {location.mapLink}
                  </a>
                </motion.div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Order Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for your order..."
                  rows={2}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-xl shadow-green-500/25 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Place Order via WhatsApp
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-4">Order Summary</h3>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-stone-800 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-3">
                <div className="flex justify-between font-bold text-lg text-stone-800 dark:text-white">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
