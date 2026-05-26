'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
import FoodCard from '@/components/food/FoodCard';
import { FoodCardSkeleton } from '@/components/ui/Skeleton';
import SearchBar from '@/components/ui/SearchBar';
import { getAllFoods, searchFoods, getFoodsByCategory } from '@/firebase/firestore';
import { CATEGORIES } from '@/utils/constants';
import { staggerContainer, staggerItem, fadeInUp } from '@/styles/animations';

function MenuContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchFoods();
  }, [activeCategory]);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (searchParam) {
      handleSearch(searchParam);
    }
  }, [categoryParam, searchParam]);

  async function fetchFoods() {
    try {
      setLoading(true);
      let result;
      if (activeCategory === 'All') {
        result = await getAllFoods();
      } else {
        result = await getFoodsByCategory(activeCategory);
      }
      setFoods(result);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query) {
    if (!query.trim()) {
      fetchFoods();
      return;
    }
    try {
      setLoading(true);
      const results = await searchFoods(query);
      setFoods(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }

  // Sort foods
  const sortedFoods = [...foods].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-white">
          Our <span className="gradient-text">Menu</span>
        </h1>
        <p className="mt-3 text-stone-500 dark:text-stone-400 max-w-md mx-auto">
          Explore our delicious selection of freshly prepared dishes
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8 space-y-4"
      >
        <SearchBar onSearch={handleSearch} className="max-w-lg mx-auto" />

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === 'All'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white dark:bg-dark-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-primary-300'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.name
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white dark:bg-dark-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-primary-300'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Showing <span className="font-semibold text-stone-700 dark:text-stone-200">{sortedFoods.length}</span> items
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-white dark:bg-dark-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-600 dark:text-stone-300 focus:border-primary-500"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Food Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <motion.div key={`skeleton-${i}`} variants={staggerItem}>
                  <FoodCardSkeleton />
                </motion.div>
              ))
            : sortedFoods.map((food) => (
                <motion.div key={food.id} variants={staggerItem} layout>
                  <FoodCard food={food} />
                </motion.div>
              ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {!loading && sortedFoods.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-stone-700 dark:text-stone-200 mb-2">
            No foods found
          </h3>
          <p className="text-stone-500 dark:text-stone-400">
            Try a different search or category
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
