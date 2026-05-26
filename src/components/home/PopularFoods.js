'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import FoodCard from '@/components/food/FoodCard';
import { FoodCardSkeleton } from '@/components/ui/Skeleton';
import { staggerContainer, staggerItem } from '@/styles/animations';

export default function PopularFoods({ foods = [], loading = false }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        {/* Section Header */}
        <motion.div variants={staggerItem} className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-accent-500" />
              <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-white">
              Popular <span className="gradient-text">Picks</span>
            </h2>
          </div>
          <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <FoodCardSkeleton />
                </motion.div>
              ))
            : foods.slice(0, 8).map((food) => (
                <motion.div key={food.id} variants={staggerItem}>
                  <FoodCard food={food} />
                </motion.div>
              ))}
        </div>

        {/* Mobile View All */}
        <motion.div variants={staggerItem} className="mt-8 text-center sm:hidden">
          <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-semibold text-sm"
            >
              View All Menu
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
