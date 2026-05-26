'use client';

import { useState, useEffect } from 'react';
import { getAllOrders, getUserOrders } from '@/firebase/firestore';

export function useOrders(userId = null, isAdmin = false) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        let result;
        if (isAdmin) {
          result = await getAllOrders();
        } else if (userId) {
          result = await getUserOrders(userId);
        } else {
          result = [];
        }
        setOrders(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId, isAdmin]);

  const refresh = async () => {
    try {
      setLoading(true);
      let result;
      if (isAdmin) {
        result = await getAllOrders();
      } else if (userId) {
        result = await getUserOrders(userId);
      } else {
        result = [];
      }
      setOrders(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refresh, setOrders };
}
