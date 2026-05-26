import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { SAMPLE_FOODS, CATEGORIES } from './constants';

// Seed categories into Firestore
export async function seedCategories() {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);

  if (snapshot.size > 0) {
    console.log('Categories already seeded');
    return false;
  }

  for (const category of CATEGORIES) {
    await addDoc(categoriesRef, {
      name: category.name,
      emoji: category.emoji,
      image: category.image,
      createdAt: new Date().toISOString(),
    });
  }

  console.log(`Seeded ${CATEGORIES.length} categories`);
  return true;
}

// Seed foods into Firestore
export async function seedFoods() {
  const foodsRef = collection(db, 'foods');
  const snapshot = await getDocs(foodsRef);

  if (snapshot.size > 0) {
    console.log('Foods already seeded');
    return false;
  }

  for (const food of SAMPLE_FOODS) {
    const placeholder = `https://placehold.co/400x300/f97316/white?text=${encodeURIComponent(food.name.split(' ')[0])}`;
    await addDoc(foodsRef, {
      ...food,
      image: food.image || placeholder,
      createdAt: new Date().toISOString(),
    });
  }

  console.log(`Seeded ${SAMPLE_FOODS.length} foods`);
  return true;
}

// Seed all data
export async function seedAll() {
  const results = {
    categories: await seedCategories(),
    foods: await seedFoods(),
  };
  return results;
}
