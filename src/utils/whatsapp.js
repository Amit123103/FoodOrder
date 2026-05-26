import { formatPrice } from './helpers';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

// Build formatted WhatsApp order message
export function buildOrderMessage(orderData) {
  const {
    customerName,
    phone,
    items,
    subtotal,
    deliveryFee,
    discount,
    totalPrice,
    address,
    latitude,
    longitude,
    mapLink,
    notes,
    orderId,
  } = orderData;

  let message = `🍔 *New Food Order*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📋 *Order ID:* ${orderId}\n`;
  message += `👤 *Customer:* ${customerName}\n`;
  message += `📞 *Phone:* ${phone}\n\n`;
  message += `🛒 *Order Items:*\n`;
  message += `─────────────────\n`;

  items.forEach((item) => {
    message += `• ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
  });

  message += `─────────────────\n`;
  message += `💰 Subtotal: ${formatPrice(subtotal)}\n`;
  message += `🚚 Delivery: ${formatPrice(deliveryFee)}\n`;

  if (discount > 0) {
    message += `🎫 Discount: -${formatPrice(discount)}\n`;
  }

  message += `\n💵 *Total: ${formatPrice(totalPrice)}*\n\n`;
  message += `📍 *Delivery Address:*\n${address}\n\n`;

  if (mapLink) {
    message += `🗺️ *Live Location:*\n${mapLink}\n\n`;
  }

  if (notes) {
    message += `📝 *Order Notes:*\n${notes}\n\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `🕐 ${new Date().toLocaleString('en-IN')}\n`;
  message += `Powered by FoodieExpress 🚀`;

  return message;
}

// Open WhatsApp with the order message
export function sendToWhatsApp(message) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

// Generate Google Maps link from coordinates
export function generateMapLink(latitude, longitude) {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}
