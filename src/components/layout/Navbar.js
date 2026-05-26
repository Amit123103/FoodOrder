'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Sun, Moon, ChefHat, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { signOutUser } from '@/firebase/auth';
import { NAV_LINKS } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
      window.location.href = '/';
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const isActive = (href) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-black/5'
          : 'bg-white/0 dark:bg-dark-900/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 20 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <ChefHat className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold font-heading">
              <span className="gradient-text">Foodie</span>
              <span className="text-stone-800 dark:text-white">Express</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-stone-600 dark:text-stone-300 hover:text-primary-600 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {link.name}
                {link.name === 'Cart' && itemCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-500 rounded-full">
                    {itemCount}
                  </span>
                )}
                {link.name === 'Wishlist' && wishlistCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent-500 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-colors ${
                darkMode 
                  ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' 
                  : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>

            {/* Cart Icon */}
            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Auth */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Link href="/admin">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin
                        </motion.button>
                      </Link>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                        {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-200 max-w-[100px] truncate">
                        {user.displayName || 'User'}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSignOut}
                      className="p-2.5 rounded-xl text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Sign out"
                    >
                      <LogOut className="w-5 h-5" />
                    </motion.button>
                  </div>
                ) : (
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </motion.button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-stone-600 dark:text-stone-300" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-stone-200 dark:border-stone-700"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.name}
                  {link.name === 'Cart' && itemCount > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary-500 rounded-full">
                      {itemCount}
                    </span>
                  )}
                  {link.name === 'Wishlist' && wishlistCount > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-accent-500 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between px-4">
                <button
                  onClick={toggleDarkMode}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    darkMode 
                      ? 'bg-indigo-500/10 text-indigo-400' 
                      : 'bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </button>

                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 py-3 text-sm text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-3 text-sm text-primary-600"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
