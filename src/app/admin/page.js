'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Users, UtensilsCrossed, TrendingUp, Clock } from 'lucide-react';
import { getAllOrders, getAllFoods, getAllUsers } from '@/firebase/firestore';
import { formatPrice, formatDate, getStatusColor } from '@/utils/helpers';
import { staggerContainer, staggerItem } from '@/styles/animations';
import { seedAll } from '@/utils/seedData';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, foods: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [orders, foods, users] = await Promise.all([
        getAllOrders(),
        getAllFoods(),
        getAllUsers(),
      ]);

      const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      setStats({
        orders: orders.length,
        revenue,
        users: users.length,
        foods: foods.length,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const results = await seedAll();
      if (results.foods || results.categories) {
        toast.success('Sample data seeded successfully!');
        fetchDashboardData();
      } else {
        toast.success('Data already exists!');
      }
    } catch (error) {
      toast.error('Failed to seed data');
      console.error(error);
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Menu Items', value: stats.foods, icon: UtensilsCrossed, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Seed Data Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSeedData}
          disabled={seeding}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {seeding ? 'Seeding...' : '🌱 Seed Sample Data'}
        </motion.button>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={staggerItem}
            className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-stone-700 dark:text-stone-200" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-stone-800 dark:text-white">
              {loading ? '...' : card.value}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800">
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-400" />
            <h3 className="font-bold text-stone-800 dark:text-white">Recent Orders</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-400">Loading...</td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-400">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-50 dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-dark-900/50">
                    <td className="px-5 py-3 font-mono text-xs text-primary-600 dark:text-primary-400">
                      {order.orderId || order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3 text-stone-700 dark:text-stone-200">{order.customerName}</td>
                    <td className="px-5 py-3 font-semibold text-stone-800 dark:text-white">{formatPrice(order.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-500 dark:text-stone-400 text-xs">{formatDate(order.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
