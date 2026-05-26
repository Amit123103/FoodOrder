'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Mail } from 'lucide-react';
import { getAllUsers, updateUserRole } from '@/firebase/firestore';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (uid, newRole) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-white">User Management</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">{users.length} registered users</p>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-dark-900/50">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-stone-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-stone-400">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.uid || user.id} className="border-b border-stone-50 dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-dark-900/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 dark:text-white">{user.name || 'Unknown'}</p>
                          {user.phone && <p className="text-xs text-stone-400">{user.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
                      }`}>
                        {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-500 dark:text-stone-400 text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user.uid || user.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-600 dark:text-stone-300 cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
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
