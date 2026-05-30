# Ayush Food Junction

A complete restaurant ordering system and admin dashboard built with React, Vite, and TailwindCSS.

## 🔐 Admin OTP Login Instructions
The Owner Portal uses a **Simulated 4-Digit Mobile OTP System** for prototype testing without incurring SMS costs.
To access the Admin Dashboard:
1. Navigate to the Owner Portal.
2. The input will default to the owner's mobile number: `+91 9779509769`.
3. Click **Send OTP**.
4. Your browser will instantly display an `alert()` pop-up containing a secure 4-digit code (simulating a text message).
5. Enter that 4-digit code into the screen and click **Verify & Login**.

## 🔥 Firebase Setup Instructions

The app is now fully integrated with Firebase Cloud Firestore for permanent data storage! If you are deploying this or setting up the database for the first time, follow these crucial steps in your Firebase Console:

### 1. Enable Firestore Database
- Go to your [Firebase Console](https://console.firebase.google.com/).
- In the left sidebar under **Build**, click on **Firestore Database**.
- Click **Create Database**.
- Choose a location closest to your users.
- Start in **Test Mode** (or see security rules below if going to production).

### 2. Firestore Security Rules
By default, test mode expires after 30 days. To ensure your app continues to work permanently, you need to update the database Security Rules.

Go to the **Rules** tab in Firestore and replace the code with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read menu items, but only the app can write (currently open for admin simplicity)
    match /menuItems/{document=**} {
      allow read, write: if true; 
    }
    
    // Anyone can read and write feedbacks
    match /feedbacks/{document=**} {
      allow read, write: if true;
    }
  }
}
```
*(Note: In a real enterprise app, you would lock down `write` access on `menuItems` using Firebase Authentication. Since this app uses a custom frontend password system, we leave Firestore open but rely on the React frontend to hide the admin dashboard).*

### 3. Local Environment Setup
Ensure your `.env` file exists in the root of the project with the keys you registered:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
...
```

### 4. Running the App
Run the following commands to start your local server:
```bash
npm install
npm run dev
```
