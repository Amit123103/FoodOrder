'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import Categories from '@/components/home/Categories';
import FeaturedFoods from '@/components/home/FeaturedFoods';
import PopularFoods from '@/components/home/PopularFoods';
import Banner from '@/components/home/Banner';
import UserDashboard from '@/components/home/UserDashboard';
import { getFeaturedFoods, getPopularFoods } from '@/firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  
  const { user, loading: loadingAuth } = useAuth();

  useEffect(() => {
    // Only fetch landing page data if not logged in
    if (!user) {
      async function fetchData() {
        try {
          const [featured, popular] = await Promise.all([
            getFeaturedFoods(8),
            getPopularFoods(8),
          ]);
          setFeaturedFoods(featured);
          setPopularFoods(popular);
        } catch (error) {
          console.error('Error fetching home data:', error);
        } finally {
          setLoadingFoods(false);
        }
      }

      fetchData();
    }
  }, [user]);

  if (loadingAuth) {
    return <PageLoader />;
  }

  // If user is logged in, show the full interactive user hub
  if (user) {
    return <UserDashboard />;
  }

  // Otherwise, show the default marketing landing page
  return (
    <>
      <HeroSection />
      <Categories />
      <FeaturedFoods foods={featuredFoods} loading={loadingFoods} />
      <Banner />
      <PopularFoods foods={popularFoods} loading={loadingFoods} />
    </>
  );
}
