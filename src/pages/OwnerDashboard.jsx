import React, { useState } from 'react';
import { LogOut, Trash2, Edit2, Check, X } from 'lucide-react';
import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';

const OwnerDashboard = ({ setIsOwnerLoggedIn, setCurrentPage, menuItems, setMenuItems, isDeliveryAvailable, isShopOpen, categories = [] }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    category: categories[0] || 'Starters',
    price: '',
    description: '',
    available: true,
    emoji: '🍽️',
    emoji: '🍽️',
    image: '/assets/images/default-food.jpg'
  });
  const [editingId, setEditingId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert("Category already exists!");
      return;
    }
    try {
      const updatedList = [...categories, newCategoryName.trim()];
      await setDoc(doc(db, 'menuItems', '_store_categories_'), { list: updatedList }, { merge: true });
      setNewCategoryName('');
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (catToDelete) => {
    if (window.confirm(`Are you sure you want to delete the category "${catToDelete}"?`)) {
      try {
        const updatedList = categories.filter(c => c !== catToDelete);
        await setDoc(doc(db, 'menuItems', '_store_categories_'), { list: updatedList }, { merge: true });
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category.");
      }
    }
  };

  const toggleShopStatus = async () => {
    try {
      const settingsRef = doc(db, 'menuItems', '_store_settings_');
      await setDoc(settingsRef, {
        isShopOpen: !isShopOpen
      }, { merge: true });
    } catch (error) {
      console.error("Error toggling shop status:", error);
      alert("Failed to update shop status.");
    }
  };

  const handleLogout = () => {
    setIsOwnerLoggedIn(false);
    setCurrentPage('home');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({
      ...newItem,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image to prevent localStorage QuotaExceededError
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setNewItem(prev => ({
            ...prev,
            image: dataUrl
          }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    try {
      if (editingId) {
        // Update existing item in Firestore
        const itemRef = doc(db, 'menuItems', editingId);
        await updateDoc(itemRef, {
          ...newItem,
          price: parseInt(newItem.price, 10) || 0
        });
        setEditingId(null);
      } else {
        // Add new item to Firestore
        await addDoc(collection(db, 'menuItems'), {
          ...newItem,
          price: parseInt(newItem.price, 10) || 0,
          createdAt: new Date().toISOString()
        });
      }
      
      // Reset form
      setNewItem({
        name: '',
        category: categories[0] || 'Starters',
        price: '',
        description: '',
        available: true,
        emoji: '🍽️',
        image: '/assets/images/default-food.jpg'
      });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      alert("Failed to save food item. Check console.");
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let uploadedCount = 0;
        
        // Normalize keys to handle spaces and case differences
        const normalizedJsonData = jsonData.map(row => {
          const normalizedRow = {};
          for (const key in row) {
            if (Object.hasOwnProperty.call(row, key)) {
              normalizedRow[key.trim().toLowerCase()] = row[key];
            }
          }
          return normalizedRow;
        });
        
        for (const row of normalizedJsonData) {
          const name = row.name;
          const price = row.price;
          if (!name || price === undefined || price === null || price === '') continue;

          const category = row.category || categories[0] || 'Starters';
          const description = row.description || '';
          const imageUrl = row.imageurl || row.image || '/assets/images/default-food.jpg';
          const available = row.available !== undefined ? (String(row.available).trim().toLowerCase() === 'true' || String(row.available).trim().toLowerCase() === 'yes' || row.available === 1 || row.available === true) : true;
          
          await addDoc(collection(db, 'menuItems'), {
            name: String(name).trim(),
            category: String(category).trim(),
            price: parseInt(price, 10) || 0,
            description: String(description).trim(),
            available,
            emoji: '🍽️',
            image: imageUrl,
            createdAt: new Date().toISOString()
          });
          uploadedCount++;
        }
        
        alert(`Successfully uploaded ${uploadedCount} items!`);
      } catch (error) {
        console.error("Error uploading Excel data:", error);
        alert("Failed to upload Excel data. Please check the file format.");
      } finally {
        setIsUploading(false);
        e.target.value = null; // Reset file input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Name: 'Sample Pizza', Category: 'Main Course', Price: 299, Description: 'Delicious cheesy pizza', Available: true, ImageURL: 'https://example.com/pizza.jpg' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Food_Upload_Template.xlsx");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || '',
      available: item.available,
      emoji: item.emoji || '🍽️',
      image: item.image || '/assets/images/default-food.jpg'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewItem({
      name: '',
      category: categories[0] || 'Starters',
      price: '',
      description: '',
      available: true,
      emoji: '🍽️',
      image: '/assets/images/default-food.jpg'
    });
  };

  const toggleAvailability = async (id) => {
    try {
      const item = menuItems.find(i => i.id === id);
      if (!item) return;

      const itemRef = doc(db, 'menuItems', id);
      await updateDoc(itemRef, {
        available: !item.available
      });
      
      // Update local state for immediate feedback
      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, available: !item.available } : item
      ));
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update item availability.");
    }
  };

  const toggleGlobalDelivery = async () => {
    try {
      const settingsRef = doc(db, 'menuItems', '_store_settings_');
      await setDoc(settingsRef, {
        isDeliveryAvailable: !isDeliveryAvailable
      }, { merge: true });
    } catch (error) {
      console.error("Error toggling delivery:", error);
      alert("Failed to update delivery settings.");
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'menuItems', id));
      } catch (error) {
        console.error("Error deleting from Firestore:", error);
        alert("Failed to delete item.");
      }
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="font-playfair font-bold text-2xl text-brown-golden">
            Ayush Food Junction
          </h1>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-green-dark">Owner Dashboard</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-bold text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Global Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-playfair text-xl font-bold text-brown-dark mb-1">Store Controls</h2>
            <p className="text-sm text-gray-500">Manage your restaurant's global availability.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Shop Status Toggle */}
            <div className="flex items-center justify-between gap-4 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 flex-1 md:flex-none">
              <span className={`font-bold text-sm ${isShopOpen ? 'text-green-600' : 'text-red-500'}`}>
                {isShopOpen ? '🟢 Shop Open' : '🔴 Shop Closed'}
              </span>
              <button 
                onClick={toggleShopStatus}
                className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none ${isShopOpen ? 'bg-green-500' : 'bg-red-400'}`}
              >
                <span className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-sm transition-transform ${isShopOpen ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Delivery Toggle */}
            <div className={`flex items-center justify-between gap-4 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 flex-1 md:flex-none transition-opacity ${!isShopOpen ? 'opacity-50 pointer-events-none' : ''}`}>
              <span className={`font-bold text-sm ${isDeliveryAvailable ? 'text-teal-600' : 'text-gray-500'}`}>
                {isDeliveryAvailable ? '🚚 Delivery Available' : '🥡 Takeaway Only'}
              </span>
              <button 
                onClick={toggleGlobalDelivery}
                className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none ${isDeliveryAvailable ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-sm transition-transform ${isDeliveryAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Manage Categories & Add Item */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Manage Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-playfair text-xl font-bold text-brown-dark mb-4 border-b border-gray-100 pb-3">
                Manage Categories
              </h2>
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category Name"
                  className="flex-1 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                  required
                />
                <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 rounded transition-colors text-sm">
                  Add
                </button>
              </form>
              <div className="max-h-48 overflow-y-auto pr-2 flex flex-col gap-2">
                {categories.map(cat => (
                  <div key={cat} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="font-bold text-sm text-gray-700">{cat}</span>
                    <button 
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-red-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-playfair text-xl font-bold text-brown-dark mb-4 border-b border-gray-100 pb-3 flex justify-between items-center">
                Bulk Upload
                <button 
                  onClick={downloadTemplate}
                  className="text-xs text-blue-500 hover:text-blue-700 font-normal"
                >
                  Download Template
                </button>
              </h2>
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500">
                  Upload an Excel file (.xlsx) to add multiple menu items at once.
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleExcelUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className={`flex justify-center items-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed font-bold transition-colors ${
                      isUploading ? 'bg-gray-100 border-gray-300 text-gray-400' : 'border-teal-500 text-teal-600 hover:bg-teal-50 cursor-pointer'
                    }`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Excel Data'}
                  </label>
                </div>
              </div>
            </div>

            {/* Add New Item Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-playfair text-xl font-bold text-brown-dark mb-6 border-b border-gray-100 pb-3">
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h2>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Item Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={newItem.name} 
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label>
                    <select 
                      name="category" 
                      value={newItem.category} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Price (₹)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={newItem.price} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Item Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border border-gray-200 rounded p-1.5 focus:ring-1 focus:ring-teal-500 outline-none text-sm text-gray-600"
                  />
                  {newItem.image && newItem.image !== '/assets/images/default-food.jpg' && (
                    <img src={newItem.image} alt="Preview" className="mt-2 h-16 w-24 object-cover rounded shadow-sm border border-gray-100" />
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={newItem.description} 
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                  ></textarea>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="available" 
                    name="available" 
                    checked={newItem.available} 
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <label htmlFor="available" className="text-sm font-bold text-gray-700">Available on Menu</label>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-green-dark hover:bg-green-sage text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    {editingId ? 'Update Item' : 'Add Item'}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Manage Menu Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-playfair text-xl font-bold text-brown-dark">
                  Manage Menu
                </h2>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                  {menuItems.length} Items Total
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Price</th>
                      <th className="p-4 font-bold">Available</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {menuItems.map(item => (
                      <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${!item.available ? 'opacity-60 bg-gray-50' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded shadow-sm flex-shrink-0" />
                            <div>
                              <p className="font-bold text-brown-dark">{item.name}</p>
                              <p className="text-xs text-gray-500 truncate w-48">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{item.category}</td>
                        <td className="p-4 text-sm font-bold text-brown-golden">₹{item.price}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleAvailability(item.id)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${item.available ? 'bg-teal-500' : 'bg-gray-300'}`}
                          >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.available ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            type="button"
                            onClick={() => startEdit(item)}
                            className="text-blue-400 hover:text-blue-600 p-2 transition-colors mr-2"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            className="text-red-400 hover:text-red-600 p-2 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
