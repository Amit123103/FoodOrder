'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import FoodCard from '@/components/food/FoodCard';
import { FoodCardSkeleton } from '@/components/ui/Skeleton';
import { staggerContainer, staggerItem } from '@/styles/animations';

export default function FeaturedFoods({ foods = [], loading = false }) {
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
              <Flame className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Top Rated
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-white">
              Featured <span className="gradient-text">Foods</span>
            </h2>
          </div>
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

        {foods.length === 0 && !loading && (
          <div className="text-center py-12 text-stone-400 dark:text-stone-500">
            <p className="text-lg">No featured foods available yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
