export const APP_NAME = 'FoodieExpress';

export const DELIVERY_FEE = Number(process.env.NEXT_PUBLIC_DELIVERY_FEE) || 40;

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || '₹';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'out for delivery',
  'delivered',
  'cancelled',
];

export const CATEGORIES = [
  { name: 'Pizza', emoji: '🍕', image: '/categories/pizza.jpg' },
  { name: 'Burger', emoji: '🍔', image: '/categories/burger.jpg' },
  { name: 'Drinks', emoji: '🥤', image: '/categories/drinks.jpg' },
  { name: 'Fast Food', emoji: '🍟', image: '/categories/fastfood.jpg' },
  { name: 'Indian Food', emoji: '🍛', image: '/categories/indian.jpg' },
  { name: 'Desserts', emoji: '🍰', image: '/categories/desserts.jpg' },
];

export const COUPON_CODES = {
  'FOODIE10': { discount: 10, type: 'percentage', description: '10% off on your order' },
  'WELCOME50': { discount: 50, type: 'flat', description: '₹50 off on your first order' },
  'FEAST20': { discount: 20, type: 'percentage', description: '20% off on orders above ₹500' },
  'FREE DELIVERY': { discount: 40, type: 'delivery', description: 'Free delivery on your order' },
};

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'Cart', href: '/cart' },
  { name: 'Wishlist', href: '/wishlist' },
];

export const SAMPLE_FOODS = [
  // Pizza
  { name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese on a hand-tossed thin crust', category: 'Pizza', price: 299, rating: 4.5, image: '' },
  { name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni slices, mozzarella cheese, and our signature sauce', category: 'Pizza', price: 399, rating: 4.7, image: '' },
  { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with tender chicken, onions, and extra cheese', category: 'Pizza', price: 449, rating: 4.6, image: '' },
  { name: 'Veggie Supreme', description: 'A garden fresh delight with capsicum, onion, tomato, mushroom, and olives', category: 'Pizza', price: 349, rating: 4.3, image: '' },
  { name: 'Paneer Tikka Pizza', description: 'Indian-style pizza with spicy paneer tikka, onions, and capsicum', category: 'Pizza', price: 379, rating: 4.4, image: '' },

  // Burger
  { name: 'Classic Cheese Burger', description: 'Juicy beef patty with melted cheddar cheese, lettuce, and our special sauce', category: 'Burger', price: 199, rating: 4.4, image: '' },
  { name: 'Chicken Zinger', description: 'Crispy fried chicken fillet with spicy mayo, lettuce, and fresh tomato', category: 'Burger', price: 249, rating: 4.6, image: '' },
  { name: 'Veggie Crunch Burger', description: 'Crispy vegetable patty with fresh veggies and creamy sauce', category: 'Burger', price: 179, rating: 4.2, image: '' },
  { name: 'Double Decker Burger', description: 'Two juicy patties with double cheese, pickles, and tangy ketchup', category: 'Burger', price: 349, rating: 4.8, image: '' },

  // Drinks
  { name: 'Mango Smoothie', description: 'Fresh mango blended with yogurt and a hint of honey', category: 'Drinks', price: 129, rating: 4.5, image: '' },
  { name: 'Iced Coffee', description: 'Premium cold brew coffee with milk and caramel drizzle', category: 'Drinks', price: 149, rating: 4.3, image: '' },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime soda with mint leaves and a pinch of salt', category: 'Drinks', price: 79, rating: 4.1, image: '' },
  { name: 'Chocolate Shake', description: 'Rich chocolate milkshake topped with whipped cream and choco chips', category: 'Drinks', price: 169, rating: 4.6, image: '' },

  // Fast Food
  { name: 'French Fries', description: 'Crispy golden fries seasoned with our special spice blend', category: 'Fast Food', price: 99, rating: 4.2, image: '' },
  { name: 'Chicken Nuggets', description: '8 pieces of crispy chicken nuggets with dipping sauces', category: 'Fast Food', price: 199, rating: 4.4, image: '' },
  { name: 'Loaded Nachos', description: 'Crunchy nachos with cheese sauce, jalapenos, and salsa', category: 'Fast Food', price: 179, rating: 4.3, image: '' },
  { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with sweet chili dipping sauce', category: 'Fast Food', price: 149, rating: 4.1, image: '' },

  // Indian Food
  { name: 'Butter Chicken', description: 'Tender chicken in rich creamy tomato-butter sauce, a North Indian classic', category: 'Indian Food', price: 349, rating: 4.8, image: '' },
  { name: 'Paneer Butter Masala', description: 'Soft paneer cubes in a creamy buttery tomato gravy', category: 'Indian Food', price: 299, rating: 4.6, image: '' },
  { name: 'Biryani', description: 'Fragrant basmati rice layered with spiced meat and aromatic herbs', category: 'Indian Food', price: 279, rating: 4.7, image: '' },
  { name: 'Chole Bhature', description: 'Spicy chickpea curry served with fluffy deep-fried bread', category: 'Indian Food', price: 199, rating: 4.5, image: '' },
  { name: 'Dal Makhani', description: 'Creamy black lentils slow-cooked overnight with butter and spices', category: 'Indian Food', price: 249, rating: 4.4, image: '' },

  // Desserts
  { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in aromatic rose-flavored sugar syrup', category: 'Desserts', price: 99, rating: 4.5, image: '' },
  { name: 'Chocolate Brownie', description: 'Warm fudgy brownie topped with vanilla ice cream and chocolate sauce', category: 'Desserts', price: 179, rating: 4.7, image: '' },
  { name: 'Rasmalai', description: 'Soft paneer discs soaked in cardamom-flavored sweetened milk', category: 'Desserts', price: 149, rating: 4.6, image: '' },
  { name: 'Ice Cream Sundae', description: 'Three scoops of premium ice cream with nuts, sauce, and cherry on top', category: 'Desserts', price: 199, rating: 4.4, image: '' },
];
