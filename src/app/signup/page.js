'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ChefHat, Loader2 } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '@/firebase/auth';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { fadeInUp } from '@/styles/animations';

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    router.push('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error) {
      const msg = error.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : error.code === 'auth/weak-password'
        ? 'Password is too weak'
        : 'Sign up failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading">
              <span className="gradient-text">Foodie</span>
              <span className="text-stone-800 dark:text-white">Express</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-1">Create Account</h1>
          <p className="text-stone-500 dark:text-stone-400 mb-8">Join FoodieExpress and start ordering</p>

          {/* Google Signup */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignup}
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

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs text-stone-400 uppercase">or</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 chars)"
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

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500"
                />
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-500 via-primary-500 to-primary-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white rounded-full" />
          <div className="absolute bottom-32 left-20 w-56 h-56 bg-white rounded-full" />
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
            🍔
          </motion.div>
          <h2 className="text-4xl font-bold font-heading mb-4">Join Us Today!</h2>
          <p className="text-white/80 text-lg max-w-sm">
            Create an account and enjoy exclusive offers, fast delivery, and delicious food
          </p>
        </motion.div>
      </div>
    </div>
  );
}
