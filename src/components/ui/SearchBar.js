'use client';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search for foods...', className = '' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-dark-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-800 dark:text-white placeholder-stone-400 focus:border-primary-500 dark:focus:border-primary-500 transition-colors text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.form>
  );
}
