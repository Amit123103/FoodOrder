'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, X, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CouponInput() {
  const { couponCode, setCouponCode, applyCoupon, removeCoupon, appliedCoupon } = useCart();

  const handleApply = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
    }
  };

  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
      >
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500">
              {appliedCoupon.description}
            </p>
          </div>
        </div>
        <button
          onClick={removeCoupon}
          className="p-1 text-green-600 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleApply}
        className="px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
      >
        Apply
      </motion.button>
    </div>
  );
}
