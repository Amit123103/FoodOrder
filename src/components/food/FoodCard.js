'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import Rating from '@/components/ui/Rating';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, truncateText } from '@/utils/helpers';

export default function FoodCard({ food }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const cartItem = cartItems.find((item) => item.id === food.id);
  const inWishlist = isInWishlist(food.id);

  const defaultImage = `https://placehold.co/400x300/f97316/white?text=${encodeURIComponent(food.name?.split(' ')[0] || 'Food')}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 card-hover"
    >
      {/* Image */}
      <div className="relative food-image-container h-48 bg-stone-100 dark:bg-stone-800">
        <img
          src={food.image || defaultImage}
          alt={food.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm text-xs font-semibold text-stone-700 dark:text-stone-200 rounded-full">
            {food.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(food);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist
                ? 'text-red-500 fill-red-500'
                : 'text-stone-400 group-hover:text-red-400'
            }`}
          />
        </motion.button>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 bg-primary-500 text-white text-sm font-bold rounded-xl shadow-lg">
            {formatPrice(food.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-stone-800 dark:text-white text-lg leading-tight">
          {food.name}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
          {truncateText(food.description, 65)}
        </p>

        {/* Rating */}
        <div className="mt-2">
          <Rating value={food.rating || 0} />
        </div>

        {/* Add to Cart */}
        <div className="mt-4">
          {cartItem ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-stone-50 dark:bg-dark-900 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(food.id, cartItem.quantity - 1)}
                  className="w-8 h-8 bg-white dark:bg-dark-800 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </motion.button>
                <span className="text-sm font-bold text-stone-800 dark:text-white w-6 text-center">
                  {cartItem.quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(food.id, cartItem.quantity + 1)}
                  className="w-8 h-8 bg-white dark:bg-dark-800 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </motion.button>
              </div>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(food.price * cartItem.quantity)}
              </span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(food)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
