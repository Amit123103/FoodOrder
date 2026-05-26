'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, MapPin, Phone, Clock, Filter } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/firebase/firestore';
import { formatPrice, formatDate, getStatusColor } from '@/utils/helpers';
import { ORDER_STATUSES } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-white">Order Management</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">{orders.length} total orders</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              filter === 'all' ? 'bg-primary-500 text-white' : 'bg-stone-100 dark:bg-dark-900 text-stone-600 dark:text-stone-300'
            }`}
          >
            All
          </button>
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap ${
                filter === status ? 'bg-primary-500 text-white' : 'bg-stone-100 dark:bg-dark-900 text-stone-600 dark:text-stone-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-dark-900/50">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-stone-400">Loading...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-stone-400">No orders found</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-50 dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-dark-900/50">
                    <td className="px-5 py-3 font-mono text-xs text-primary-600 dark:text-primary-400">
                      {order.orderId || order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-stone-800 dark:text-white">{order.customerName}</p>
                        <p className="text-xs text-stone-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-stone-600 dark:text-stone-300">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-5 py-3 font-semibold text-stone-800 dark:text-white">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border-0 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-stone-500 dark:text-stone-400 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.mapLink && (
                          <a
                            href={order.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-stone-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          >
                            <MapPin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 p-6"
        >
          <h3 className="font-bold text-stone-800 dark:text-white mb-4">
            Order Details — {selectedOrder.orderId || selectedOrder.id.slice(0, 8)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Customer</p>
                <p className="text-sm font-medium text-stone-800 dark:text-white">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Phone</p>
                <p className="text-sm text-stone-600 dark:text-stone-300">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Address</p>
                <p className="text-sm text-stone-600 dark:text-stone-300">{selectedOrder.address}</p>
              </div>
              {selectedOrder.notes && (
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Notes</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-2">Items</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-300">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-stone-800 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-stone-100 dark:border-stone-700 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-stone-800 dark:text-white">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
