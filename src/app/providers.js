'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1c1917',
                color: '#fafaf9',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#f43f5e', secondary: '#fff' },
              },
            }}
          />
          {!isAdminRoute && <Navbar />}
          <main className={!isAdminRoute ? 'pt-16 md:pt-20 min-h-screen' : 'min-h-screen'}>
            {children}
          </main>
          {!isAdminRoute && <Footer />}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
