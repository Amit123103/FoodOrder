'use client';

import { useState, useEffect } from 'react';
import { getAllFoods, getFoodsByCategory, searchFoods } from '@/firebase/firestore';

export function useFoods(category = null) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFoods() {
      try {
        setLoading(true);
        let result;
        if (category) {
          result = await getFoodsByCategory(category);
        } else {
          result = await getAllFoods();
        }
        setFoods(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFoods();
  }, [category]);

  const search = async (term) => {
    if (!term.trim()) {
      const all = await getAllFoods();
      setFoods(all);
      return;
    }
    setLoading(true);
    try {
      const results = await searchFoods(term);
      setFoods(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { foods, loading, error, search, setFoods };
}
