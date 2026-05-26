'use client';

import { Star } from 'lucide-react';

export default function Rating({ value = 0, size = 'sm' }) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(value);
    const half = i === Math.floor(value) && value % 1 !== 0;
    return { filled, half, index: i };
  });

  return (
    <div className="flex items-center gap-0.5">
      {stars.map(({ filled, index }) => (
        <Star
          key={index}
          className={`${sizes[size]} ${
            filled
              ? 'text-amber-400 fill-amber-400'
              : 'text-stone-300 dark:text-stone-600'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-stone-500 dark:text-stone-400">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
