import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ClientProviders from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata = {
  title: 'FoodieExpress - Delicious Food Delivered Fast',
  description: 'Order your favorite food online from FoodieExpress. Fresh ingredients, expert chefs, and lightning-fast delivery. Pizza, Burgers, Indian Food, Desserts & more!',
  keywords: 'food delivery, order food online, pizza delivery, burger, indian food, desserts, fast food',
  authors: [{ name: 'FoodieExpress' }],
  openGraph: {
    title: 'FoodieExpress - Delicious Food Delivered Fast',
    description: 'Order your favorite food online. Fresh ingredients, expert chefs, fast delivery.',
    type: 'website',
    locale: 'en_IN',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f97316',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-stone-50 dark:bg-dark-900 text-stone-900 dark:text-stone-100 antialiased overflow-x-hidden w-full max-w-full`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
