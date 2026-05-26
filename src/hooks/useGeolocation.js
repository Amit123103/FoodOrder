'use client';

import { useState, useCallback } from 'react';
import { generateMapLink } from '@/utils/whatsapp';
import toast from 'react-hot-toast';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapLink = generateMapLink(latitude, longitude);
        setLocation({ latitude, longitude, mapLink });
        setLoading(false);
        toast.success('Location captured successfully!');
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to get location. Please enable location access.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { location, loading, error, getLocation };
}
