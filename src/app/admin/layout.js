'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Tag,
  Users,
  ChefHat,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOutUser } from '@/firebase/auth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { useState } from 'react';

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Foods', href: '/admin/foods', icon: UtensilsCrossed },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error('Admin access required');
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) return <PageLoader />;
  if (!user || !isAdmin) return null;

  const handleSignOut = async () => {
    await signOutUser();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-dark-950 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-900 border-r border-stone-200 dark:border-stone-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-stone-100 dark:border-stone-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold font-heading gradient-text">FoodieExpress</span>
                <p className="text-[10px] text-stone-400 -mt-1 uppercase tracking-wider">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-dark-800 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-dark-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-dark-800 rounded-xl"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-bold text-stone-800 dark:text-white">
                {adminLinks.find((l) => l.href === pathname)?.name || 'Admin'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                {user.displayName?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-stone-700 dark:text-stone-200 hidden sm:block">
                {user.displayName || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
