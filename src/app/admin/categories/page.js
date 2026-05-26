'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '@/firebase/firestore';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', emoji: '', image: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (cat = null) => {
    if (cat) {
      setEditing(cat);
      setFormData({ name: cat.name, emoji: cat.emoji || '', image: cat.image || '' });
    } else {
      setEditing(null);
      setFormData({ name: '', emoji: '', image: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await updateCategory(editing.id, formData);
        toast.success('Category updated');
      } else {
        await addCategory(formData);
        toast.success('Category added');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Delete category "${name}"?`)) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-white">Categories</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">{categories.length} categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))
          : categories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.emoji || '🍴'}</span>
                  <div>
                    <p className="font-semibold text-stone-800 dark:text-white">{cat.name}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(cat)}
                    className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold text-stone-800 dark:text-white">
                  {editing ? 'Edit Category' : 'Add Category'}
                </h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-stone-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name"
                    required
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    placeholder="🍕"
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-stone-100 dark:bg-dark-900 text-stone-600 dark:text-stone-300 rounded-xl text-sm font-medium">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editing ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
