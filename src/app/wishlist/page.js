'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import FoodCard from '@/components/food/FoodCard';
import { fadeInUp, staggerContainer, staggerItem } from '@/styles/animations';

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            💖
          </motion.div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-white mb-3">
            Your wishlist is empty
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md mx-auto">
            Save your favorite items here to order them later!
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
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-white">
          My <span className="gradient-text">Wishlist</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {wishlistItems.map((food) => (
            <motion.div key={food.id} variants={staggerItem} layout>
              <FoodCard food={food} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
