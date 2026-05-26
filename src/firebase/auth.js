import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export async function signUpWithEmail(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name
  await updateProfile(user, { displayName: name });

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: name,
    email: email,
    phone: '',
    role: 'user',
    createdAt: new Date().toISOString(),
  });

  return user;
}

// Sign in with email and password
export async function signInWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Sign in with Google
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if user doc exists, if not create one
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      role: 'user',
      createdAt: new Date().toISOString(),
    });
  }

  return user;
}

// Sign out
export async function signOutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_session');
    if (localStorage.getItem('demo_session')) {
       window.location.href = '/'; // hard reload if it was a demo session
    }
  }
  await firebaseSignOut(auth);
}

// Listen to auth state changes
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Get user role from Firestore
export async function getUserRole(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  return 'user';
}

// Get user profile from Firestore
export async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}
