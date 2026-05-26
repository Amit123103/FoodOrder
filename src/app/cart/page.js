'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CouponInput from '@/components/ui/CouponInput';
import { formatPrice } from '@/utils/helpers';
import { fadeInUp, staggerContainer, staggerItem } from '@/styles/animations';

export default function CartPage() {
  const {
    cartItems,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any delicious items to your cart yet. Start exploring our menu!
          </p>
          <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold shadow-xl shadow-primary-500/25"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Menu
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-white">
          Shopping <span className="gradient-text">Cart</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={staggerItem}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  layout
                  className="flex gap-4 p-4 bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700 shrink-0">
                    <img
                      src={item.image || `https://placehold.co/200x200/f97316/white?text=${encodeURIComponent(item.name?.split(' ')[0] || 'Food')}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-stone-800 dark:text-white">{item.name}</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">{item.category}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-3 bg-stone-50 dark:bg-dark-900 rounded-xl p-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white dark:bg-dark-800 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-sm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </motion.button>
                        <span className="text-sm font-bold text-stone-800 dark:text-white w-6 text-center">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-white dark:bg-dark-800 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>

                      {/* Price */}
                      <p className="font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Clear Cart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-end">
            <button
              onClick={clearCart}
              className="text-sm text-stone-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6">
              Order Summary
            </h3>

            {/* Coupon */}
            <div className="mb-6">
              <CouponInput />
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Delivery Fee</span>
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

            {/* Checkout Button */}
            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold shadow-xl shadow-primary-500/25 hover:shadow-2xl transition-all"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            {/* Delivery Info */}
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <p className="text-xs text-primary-700 dark:text-primary-400 text-center">
                🚚 Estimated delivery: 25-45 minutes
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
