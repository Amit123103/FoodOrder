'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} border-3 border-stone-200 dark:border-stone-700 border-t-primary-500 rounded-full`}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-stone-200 dark:border-stone-700 border-t-primary-500 rounded-full"
      />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-stone-500 dark:text-stone-400 text-sm font-medium"
      >
        Loading deliciousness...
      </motion.p>
    </div>
  );
}
