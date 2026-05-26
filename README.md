# 🍔 FoodieExpress — Food Ordering Web Application

A modern, full-stack food ordering web application built with **Next.js**, **Tailwind CSS**, **Firebase**, and **WhatsApp** order integration.

![FoodieExpress](https://placehold.co/1200x600/f97316/white?text=FoodieExpress)

## ✨ Features

### Customer Features
- 🏠 **Beautiful Home Page** — Hero section, featured foods, categories, promotional banners
- 🍕 **Food Menu** — Browse by category, search, sort by price/rating
- 🛒 **Cart System** — Add/remove items, quantity controls, coupon codes
- 📍 **Geolocation** — Auto-detect location with Google Maps link
- 📱 **WhatsApp Ordering** — One-click order placement via WhatsApp
- ❤️ **Wishlist** — Save favorite food items
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📦 **Order Success** — Animated confirmation page

### Admin Features
- 📊 **Dashboard** — Total orders, revenue, users, food items stats
- 🍽️ **Food Management** — Add, edit, delete food items with image upload
- 📋 **Order Management** — View all orders, update status, view customer details
- 🏷️ **Category Management** — CRUD for food categories
- 👥 **User Management** — View users, assign admin roles

### Technical Features
- 🔐 **Firebase Auth** — Email/password + Google sign-in
- 🗄️ **Firestore** — Real-time database for foods, orders, users
- 📸 **Firebase Storage** — Image uploads for food items
- 🎨 **Framer Motion** — Smooth animations throughout
- 📱 **Fully Responsive** — Mobile-first design
- 🔍 **SEO Optimized** — Meta tags, semantic HTML
- ⚡ **PWA Ready** — Installable on mobile devices

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | React Framework (App Router) |
| Tailwind CSS v4 | Styling |
| Firebase | Auth, Firestore, Storage |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Firebase project (see Firebase Setup below)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd resturant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Follow the setup wizard

### 2. Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** provider

### 3. Create Firestore Database
1. Go to **Firestore Database** → **Create Database**
2. Start in **test mode** (update rules later)
3. Choose your preferred region

### 4. Enable Storage
1. Go to **Storage** → **Get Started**
2. Start in **test mode**

### 5. Get Config
1. Go to **Project Settings** → **General**
2. Scroll to **"Your apps"** → Click Web icon
3. Copy the config object values to your `.env.local`

### 6. Deploy Security Rules
Copy the contents of `firestore.rules` to your Firestore Rules tab.

## 👤 Admin Setup

### Setting Up Admin User
1. Sign up with your email on the website
2. Go to Firebase Console → Firestore
3. Find your user document in the `users` collection
4. Change the `role` field from `"user"` to `"admin"`
5. Refresh the website — you'll see the "Admin" link in the navbar

### Seeding Sample Data
1. Log in as admin
2. Go to Admin Dashboard
3. Click **"🌱 Seed Sample Data"** button
4. This will populate 6 categories and 26 food items

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout page
│   ├── login/              # Login page
│   ├── menu/               # Menu page
│   ├── order-success/      # Order confirmation
│   ├── signup/             # Signup page
│   ├── wishlist/           # Wishlist page
│   ├── layout.js           # Root layout
│   ├── page.js             # Home page
│   └── providers.js        # Client providers
├── components/             # Reusable components
│   ├── food/               # Food-related components
│   ├── home/               # Home page sections
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # UI primitives
├── context/                # React Context providers
├── firebase/               # Firebase config & helpers
├── hooks/                  # Custom React hooks
├── styles/                 # Animation variants
└── utils/                  # Utilities & constants
```

## 🎫 Coupon Codes

| Code | Discount | Description |
|------|----------|-------------|
| `FOODIE10` | 10% | 10% off on your order |
| `WELCOME50` | ₹50 flat | ₹50 off on your first order |
| `FEAST20` | 20% | 20% off on orders above ₹500 |
| `FREE DELIVERY` | ₹40 | Free delivery on your order |

## 🚀 Deployment (Vercel)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Import Project"**
   - Select your GitHub repository

3. **Add Environment Variables**
   - Add all variables from `.env.local.example`

4. **Deploy!** 🎉

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ by FoodieExpress Team
