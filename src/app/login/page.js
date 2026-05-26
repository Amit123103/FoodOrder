'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ChefHat, Loader2 } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '@/firebase/auth';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { fadeInUp } from '@/styles/animations';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push('/');
    return null;
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (email === 'admin@demo.com' && password === 'password123') {
      // Mock admin session
      localStorage.setItem('demo_session', JSON.stringify({
        uid: 'demo-admin-id',
        email: 'admin@demo.com',
        displayName: 'Demo Admin',
        role: 'admin' // Used by AuthContext
      }));
      toast.success('Welcome back, Demo Admin!');
      window.location.href = '/admin'; // Hard reload to admin panel
      return;
    }

    if (email === 'user@demo.com' && password === 'password123') {
      // Mock user session
      localStorage.setItem('demo_session', JSON.stringify({
        uid: 'demo-user-id',
        email: 'user@demo.com',
        displayName: 'Demo User',
        role: 'user' // Used by AuthContext
      }));
      toast.success('Welcome back, Demo User!');
      window.location.href = '/'; // Hard reload to homepage
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (error) {
      const msg = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : error.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome!');
      router.push('/');
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full" />
          <div className="absolute bottom-32 right-20 w-56 h-56 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-8"
          >
            🍕
          </motion.div>
          <h2 className="text-4xl font-bold font-heading mb-4">Welcome Back!</h2>
          <p className="text-white/80 text-lg max-w-sm">
            Sign in to your account and continue ordering your favorite food
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading">
              <span className="gradient-text">Foodie</span>
              <span className="text-stone-800 dark:text-white">Express</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-1">Sign In</h1>
          <p className="text-stone-500 dark:text-stone-400 mb-8">Enter your credentials to access your account</p>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-dark-800 border border-stone-200 dark:border-stone-700 rounded-xl font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-dark-900 transition-colors disabled:opacity-50 text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs text-stone-400 uppercase">or</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@demo.com');
                  setPassword('password123');
                  toast.success('Admin demo credentials applied! Click Sign In.');
                }}
                className="w-1/2 py-2 bg-stone-100 dark:bg-dark-800 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-medium hover:bg-stone-200 dark:hover:bg-dark-700 transition-colors"
              >
                Demo Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@demo.com');
                  setPassword('password123');
                  toast.success('User demo credentials applied! Click Sign In.');
                }}
                className="w-1/2 py-2 bg-stone-100 dark:bg-dark-800 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-medium hover:bg-stone-200 dark:hover:bg-dark-700 transition-colors"
              >
                Demo User
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
