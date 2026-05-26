'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Percent } from 'lucide-react';
import { fadeInUp } from '@/styles/animations';

export default function Banner() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Percent className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Limited Time Offer</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white font-heading">
                Get 20% OFF
              </h3>
              <p className="text-white/80 mt-2 max-w-md">
                Use code <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">FEAST20</span> on orders above ₹500
              </p>
            </div>
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all text-sm"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>

          {/* Floating emojis */}
          <motion.span
            animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-4 right-4 text-4xl hidden sm:block"
          >
            🎉
          </motion.span>
          <motion.span
            animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-4 right-20 text-3xl hidden sm:block"
          >
            🍕
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
