# 🍽️ Ayush Food Junction

A modern, responsive, and dynamic Food Ordering Web Application built with React and Firebase.

## ✨ Features

### Customer Experience
*   **Beautiful UI**: Premium design with stunning color palettes, modern typography, and smooth micro-animations.
*   **Dynamic Menu**: Browse food items organized by dynamic categories.
*   **Real-Time Status**: Customers see instantly if the shop is Open/Closed or if Delivery/Takeaway is available.
*   **Shopping Cart**: Easily add, remove, and manage items in the cart with real-time total calculations.
*   **Seamless Checkout**: Smooth checkout process.

### Admin/Owner Dashboard
*   **Secure OTP Login**: A robust OTP login system (with simulated fallbacks) for the owner.
*   **Global Store Controls**: Toggle the entire restaurant's "Shop Open" and "Delivery Available" statuses with a single click.
*   **Dynamic Category Management**: Create new categories or delete existing ones instantly from the dashboard.
*   **Menu Management**: Add new menu items (with images and prices), edit existing ones, or toggle their immediate availability.
*   **Real-time Database**: Powered by Firebase Firestore for instantaneous updates across all connected clients without needing a page refresh.

## 🚀 Technology Stack

*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS / Vanilla CSS
*   **Backend & Database**: Firebase Firestore
*   **Authentication**: Firebase Phone Auth (with simulated fallback)
*   **Icons**: Lucide React

## ⚙️ Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Amit123103/FoodOrder.git
    cd FoodOrder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Firebase Setup:**
    *   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Firestore Database**.
    *   Update the `src/firebase.js` file with your Firebase config.

4.  **Run the application locally:**
    ```bash
    npm run dev
    ```

## 🔒 Security & Roles
*   The application features an Owner Login portal. Access to the dashboard allows for total control over the store's inventory, global state, and category lists.

---
*Built with ❤️ by Ayush Food Junction team.*
