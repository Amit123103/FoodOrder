'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { staggerContainer, staggerItem } from '@/styles/animations';
import { CATEGORIES } from '@/utils/constants';

export default function Categories() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        {/* Section Header */}
        <motion.div variants={staggerItem} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-white">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="mt-3 text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Find your favorite food from our wide range of categories
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <motion.div key={category.name} variants={staggerItem}>
              <Link href={`/menu?category=${encodeURIComponent(category.name)}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer group"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
