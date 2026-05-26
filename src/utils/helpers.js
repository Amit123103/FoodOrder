// Format price with currency symbol
export function formatPrice(amount) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || '₹';
  return `${currency}${Number(amount).toFixed(0)}`;
}

// Truncate text with ellipsis
export function truncateText(text, length = 80) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Format date from ISO string
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate unique order ID
export function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `FE-${timestamp}-${random}`.toUpperCase();
}

// Calculate delivery time estimate
export function getDeliveryEstimate() {
  const min = 25;
  const max = 45;
  return `${min}-${max} min`;
}

// Get status badge color
export function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'out for delivery': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || colors.pending;
}

// Validate phone number
export function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
