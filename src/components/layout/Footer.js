'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat, Mail, Phone, MapPin, Globe, MessageCircle, Share2, PlayCircle, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/styles/animations';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 dark:bg-dark-950 text-stone-300 mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white font-heading">
                Stay Updated with Our Offers
              </h3>
              <p className="text-stone-400 mt-1">Subscribe for exclusive deals and new menu items!</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 bg-stone-800 border border-stone-700 rounded-l-xl text-white placeholder-stone-500 focus:border-primary-500 w-full md:w-72"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-r-xl hover:from-primary-600 hover:to-primary-700 transition-all flex items-center gap-2 whitespace-nowrap">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* About */}
          <motion.div variants={staggerItem}>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-heading text-white">
                FoodieExpress
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              Delivering happiness to your doorstep with fresh, delicious food. Order from your favorite restaurants and enjoy premium dining at home.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Share2, PlayCircle].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center text-stone-400 hover:bg-primary-500 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerItem}>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', href: '/' },
                { name: 'Menu', href: '/menu' },
                { name: 'Cart', href: '/cart' },
                { name: 'Wishlist', href: '/wishlist' },
                { name: 'My Orders', href: '/checkout' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={staggerItem}>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {['Pizza', 'Burger', 'Drinks', 'Fast Food', 'Indian Food', 'Desserts'].map(
                (category) => (
                  <li key={category}>
                    <Link
                      href={`/menu?category=${encodeURIComponent(category)}`}
                      className="text-stone-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {category}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={staggerItem}>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-stone-400">123 Food Street, Flavor Town, India - 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="text-sm text-stone-400">+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="text-sm text-stone-400">hello@foodieexpress.com</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-stone-800 rounded-xl">
              <p className="text-xs text-stone-500 mb-1">Opening Hours</p>
              <p className="text-sm text-stone-300">Mon - Sun: 10:00 AM - 11:00 PM</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
            <p>© {currentYear} FoodieExpress. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
