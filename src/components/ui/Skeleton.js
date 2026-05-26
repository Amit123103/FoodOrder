'use client';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClasses = 'skeleton rounded-xl';

  const variants = {
    rectangular: '',
    circular: '!rounded-full',
    text: '!rounded-lg h-4',
  };

  return <div className={`${baseClasses} ${variants[variant]} ${className}`} />;
}

export function FoodCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-full h-3" />
        <Skeleton variant="text" className="w-2/3 h-3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="w-20 h-6 rounded-lg" />
          <Skeleton className="w-24 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
