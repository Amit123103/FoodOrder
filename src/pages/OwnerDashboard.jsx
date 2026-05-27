import React, { useState } from 'react';
import { LogOut, Trash2, Edit2, Check, X } from 'lucide-react';

const OwnerDashboard = ({ setIsOwnerLoggedIn, setCurrentPage, menuItems, setMenuItems }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Starters',
    price: '',
    description: '',
    available: true,
    emoji: '🍽️',
    image: '/assets/images/default-food.jpg'
  });

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
        setNewItem({
          ...newItem,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    const itemToAdd = {
      ...newItem,
      id: Date.now().toString(),
      price: parseInt(newItem.price, 10) || 0
    };
    
    setMenuItems([...menuItems, itemToAdd]);
    
    // Reset form
    setNewItem({
      name: '',
      category: 'Starters',
      price: '',
      description: '',
      available: true,
      emoji: '🍽️',
      image: '/assets/images/default-food.jpg'
    });
  };

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="font-playfair font-bold text-2xl text-brown-golden">
            Ayush Kitchen
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add New Item Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-playfair text-xl font-bold text-brown-dark mb-6 border-b border-gray-100 pb-3">
                Add New Item
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
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Desserts">Desserts</option>
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
                
                <button 
                  type="submit"
                  className="w-full bg-green-dark hover:bg-green-sage text-white font-bold py-3 rounded-lg transition-colors mt-4"
                >
                  Add Item
                </button>
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
