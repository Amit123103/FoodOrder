import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Search, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getAllFoods } from '@/firebase/firestore';
import FoodCard from '@/components/food/FoodCard';
import { FoodCardSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { staggerContainer, staggerItem, fadeInUp } from '@/styles/animations';

export default function UserDashboard() {
  const { user } = useAuth();
  const { items: cartItems, itemCount } = useCart();
  const { items: wishlistItems, wishlistCount } = useWishlist();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const result = await getAllFoods();
        setFoods(result);
      } catch (error) {
        console.error('Error fetching all foods:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Welcome Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-dark-900 rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 dark:border-stone-800"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.displayName || 'Foodie'}</span> 👋
          </h1>
          <p className="mt-2 text-stone-500 dark:text-stone-400">
            What are you craving today?
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="font-semibold text-sm">Cart</span>
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/40 transition-colors">
            <div className="relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="font-semibold text-sm">Wishlist</span>
          </Link>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="space-y-12">
        {/* Full Menu */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-heading text-stone-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-primary-500" />
              Full Menu
            </h2>
            <Link href="/menu" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Filter & Search &rarr;
            </Link>
          </div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <motion.div key={`skeleton-${i}`} variants={staggerItem}>
                      <FoodCardSkeleton />
                    </motion.div>
                  ))
                : foods.map((food) => (
                    <motion.div key={food.id} variants={staggerItem} layout>
                      <FoodCard food={food} />
                    </motion.div>
                  ))}
            </AnimatePresence>
          </motion.div>

          {!loading && foods.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-700">
              <p className="text-stone-500 dark:text-stone-400">No foods available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
