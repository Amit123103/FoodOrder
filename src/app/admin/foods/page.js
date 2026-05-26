'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { getAllFoods, addFood, updateFood, deleteFood } from '@/firebase/firestore';
import { uploadImage } from '@/firebase/storage';
import { formatPrice } from '@/utils/helpers';
import { CATEGORIES } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pizza',
    price: '',
    rating: '',
    image: '',
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  async function fetchFoods() {
    try {
      const data = await getAllFoods();
      setFoods(data);
    } catch (error) {
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', category: 'Pizza', price: '', rating: '', image: '' });
    setImageFile(null);
    setImagePreview('');
    setEditing(null);
  };

  const openModal = (food = null) => {
    if (food) {
      setEditing(food);
      setFormData({
        name: food.name,
        description: food.description,
        category: food.category,
        price: String(food.price),
        rating: String(food.rating || ''),
        image: food.image || '',
      });
      setImagePreview(food.image || '');
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'foods');
      }

      const foodData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        rating: Number(formData.rating) || 0,
        image: imageUrl || `https://placehold.co/400x300/f97316/white?text=${encodeURIComponent(formData.name.split(' ')[0])}`,
      };

      if (editing) {
        await updateFood(editing.id, foodData);
        toast.success('Food updated successfully');
      } else {
        await addFood(foodData);
        toast.success('Food added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchFoods();
    } catch (error) {
      toast.error('Failed to save food');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteFood(id);
        toast.success('Food deleted');
        fetchFoods();
      } catch (error) {
        toast.error('Failed to delete food');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-white">Food Management</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">{foods.length} items</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Food
        </motion.button>
      </div>

      {/* Foods Table */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-dark-900/50">
                <th className="px-5 py-3 font-medium">Food</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-stone-400">Loading...</td></tr>
              ) : foods.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-stone-400">No foods yet. Click &quot;Add Food&quot; to get started.</td></tr>
              ) : (
                foods.map((food) => (
                  <tr key={food.id} className="border-b border-stone-50 dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-dark-900/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700 shrink-0">
                          <img src={food.image || `https://placehold.co/100/f97316/white?text=${food.name?.[0]}`} alt={food.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800 dark:text-white">{food.name}</p>
                          <p className="text-xs text-stone-400 truncate max-w-[200px]">{food.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-700 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300">
                        {food.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-stone-800 dark:text-white">{formatPrice(food.price)}</td>
                    <td className="px-5 py-3 text-stone-600 dark:text-stone-300">⭐ {food.rating || 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(food)}
                          className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(food.id, food.name)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold text-stone-800 dark:text-white">
                  {editing ? 'Edit Food' : 'Add New Food'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-stone-300" />
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-dark-900 rounded-xl text-sm text-stone-600 dark:text-stone-300 cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Food name"
                    required
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Food description"
                    rows={2}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="299"
                      required
                      min="0"
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Rating (0-5)</label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="4.5"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-dark-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 bg-stone-100 dark:bg-dark-900 text-stone-600 dark:text-stone-300 rounded-xl text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editing ? 'Update' : 'Add Food'}
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
