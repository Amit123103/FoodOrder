import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';

// ==================== FOODS ====================

// Get all foods
export async function getAllFoods() {
  const foodsRef = collection(db, 'foods');
  const q = query(foodsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get foods by category
export async function getFoodsByCategory(category) {
  const foodsRef = collection(db, 'foods');
  const q = query(foodsRef, where('category', '==', category), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get featured foods (top rated)
export async function getFeaturedFoods(count = 8) {
  const foodsRef = collection(db, 'foods');
  const q = query(foodsRef, orderBy('rating', 'desc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get popular foods
export async function getPopularFoods(count = 8) {
  const foodsRef = collection(db, 'foods');
  const q = query(foodsRef, orderBy('createdAt', 'desc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get single food item
export async function getFoodById(id) {
  const foodDoc = await getDoc(doc(db, 'foods', id));
  if (foodDoc.exists()) {
    return { id: foodDoc.id, ...foodDoc.data() };
  }
  return null;
}

// Add food item (admin)
export async function addFood(foodData) {
  const docRef = await addDoc(collection(db, 'foods'), {
    ...foodData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Update food item (admin)
export async function updateFood(id, foodData) {
  await updateDoc(doc(db, 'foods', id), {
    ...foodData,
    updatedAt: new Date().toISOString(),
  });
}

// Delete food item (admin)
export async function deleteFood(id) {
  await deleteDoc(doc(db, 'foods', id));
}

// Listen to foods in real-time
export function onFoodsChange(callback) {
  const foodsRef = collection(db, 'foods');
  const q = query(foodsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const foods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(foods);
  });
}

// Search foods
export async function searchFoods(searchTerm) {
  const foods = await getAllFoods();
  const term = searchTerm.toLowerCase();
  return foods.filter(
    (food) =>
      food.name?.toLowerCase().includes(term) ||
      food.description?.toLowerCase().includes(term) ||
      food.category?.toLowerCase().includes(term)
  );
}

// ==================== ORDERS ====================

// Create order
export async function createOrder(orderData) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    orderStatus: 'pending',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Get all orders (admin)
export async function getAllOrders() {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get user orders
export async function getUserOrders(userId) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Update order status (admin)
export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), {
    orderStatus: status,
    updatedAt: new Date().toISOString(),
  });
}

// Listen to orders in real-time (admin)
export function onOrdersChange(callback) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
}

// ==================== CATEGORIES ====================

// Get all categories
export async function getAllCategories() {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Add category (admin)
export async function addCategory(categoryData) {
  const docRef = await addDoc(collection(db, 'categories'), {
    ...categoryData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Update category (admin)
export async function updateCategory(id, categoryData) {
  await updateDoc(doc(db, 'categories', id), categoryData);
}

// Delete category (admin)
export async function deleteCategory(id) {
  await deleteDoc(doc(db, 'categories', id));
}

// ==================== USERS ====================

// Get all users (admin)
export async function getAllUsers() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Update user role (admin)
export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, 'users', uid), { role });
}

// Update user profile
export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}
