'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Truck, Star, Sparkles } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  const handleSearch = (query) => {
    if (query.trim()) {
      router.push(`/menu?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl" />

      {/* Floating food emojis */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-[15%] text-6xl hidden lg:block"
      >
        🍕
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-48 right-[35%] text-5xl hidden lg:block"
      >
        🍔
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-32 right-[20%] text-5xl hidden lg:block"
      >
        🍰
      </motion.div>
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-60 right-[8%] text-4xl hidden lg:block"
      >
        🥤
      </motion.div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
              #1 Food Delivery App
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight"
          >
            <span className="text-stone-900 dark:text-white">Delicious Food</span>
            <br />
            <span className="gradient-text">Delivered Fast</span>
            <br />
            <span className="text-stone-900 dark:text-white">To Your Door</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-lg"
          >
            Order from your favorite restaurants and enjoy premium dining at home. Fresh ingredients, expert chefs, and lightning-fast delivery.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-md"
          >
            <SearchBar onSearch={handleSearch} placeholder="Search for pizzas, burgers, drinks..." />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(249, 115, 22, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold shadow-xl shadow-primary-500/25 text-sm"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-dark-800 text-stone-700 dark:text-stone-200 rounded-2xl font-semibold border border-stone-200 dark:border-stone-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-sm"
              >
                View Menu
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { icon: Clock, label: '25-45 min', sublabel: 'Delivery Time' },
              { icon: Truck, label: 'Free Delivery', sublabel: 'Orders ₹299+' },
              { icon: Star, label: '4.8 Rating', sublabel: '2K+ Reviews' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800 dark:text-white">{stat.label}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{stat.sublabel}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
