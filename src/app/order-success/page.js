'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Home, ShoppingBag, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ delay: 1, duration: 0.5 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-white mb-3">
          Order Placed <span className="gradient-text">Successfully!</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg mb-2">
          Your order has been sent via WhatsApp 🎉
        </p>
        {orderId && (
          <p className="text-sm text-stone-400 dark:text-stone-500 mb-8">
            Order ID: <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{orderId}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 mb-8"
      >
        <h3 className="font-bold text-stone-800 dark:text-white mb-4">What&apos;s Next?</h3>
        <div className="space-y-3 text-left">
          {[
            { step: '1', text: 'Your order has been sent to the restaurant via WhatsApp' },
            { step: '2', text: 'The restaurant will confirm your order shortly' },
            { step: '3', text: 'Your food will be prepared and delivered in 25-45 minutes' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 shrink-0">
                {item.step}
              </span>
              <p className="text-sm text-stone-600 dark:text-stone-400 pt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-stone-100 dark:bg-dark-800 text-stone-700 dark:text-stone-200 rounded-xl font-semibold"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </motion.button>
        </Link>
        <Link href="/menu">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25"
          >
            <ShoppingBag className="w-4 h-4" />
            Order More
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-stone-200 border-t-primary-500 rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
