/* =========================================================
   VINAYAK FRUIT & VEGETABLE MART
   Central data store (products, categories, rates, etc.)
   This file is the single source of truth for the demo
   frontend. When the Python backend is ready, replace these
   arrays with API calls (fetch) returning the same shape.
   ========================================================= */

const VK_CONFIG = {
  brand: "VINAYAK FRUIT & VEGETABLE MART",
  brandShort: "Vinayak Mart",
  tagline: "Fresh • Daily • Affordable",
  phone: "+91 9650067172",
  phoneRaw: "919650067172",
  whatsapp: "919650067172",
  email: "vinayakmart@example.com",
  address: "Plot No. 174/9AE, Maheshwari Nagar, Gandhidham, Kutch, Gujarat",
  mapLink: "https://maps.google.com/?q=Gandhidham,Kutch,Gujarat",
  hours: "Mon - Sun: 7:00 AM - 10:00 PM",
  currency: "₹",
};

/* ---------- Categories ---------- */
const VK_CATEGORIES = [
  { id: "fruits", name: "Fruits", count: 1, img: "assets/images/fruits.jpg" },
  { id: "vegetables", name: "Vegetables", count: 1, img: "assets/images/vegetables.jpg" },
  { id: "kesar-mango", name: "Kesar Mango", count: 1, img: "assets/images/kesar-mango.jpg" },
  { id: "banana", name: "Banana", count: 1, img: "assets/images/banana.jpg" },
  { id: "potato", name: "Potato", count: 1, img: "assets/images/potato.jpg" },
  { id: "onion", name: "Onion", count: 1, img: "assets/images/onion.jpg" },
  { id: "tomato", name: "Tomato", count: 1, img: "assets/images/tomato.jpg" },
  { id: "green-vegetables", name: "Green Vegetables", count: 1, img: "assets/images/green-vegetables.jpg" },
];

/* ---------- Products ----------
   Shape: { id, name, category, categoryId, price, oldPrice, unit,
            rating, reviews, badge, image, gallery[], description }
*/
const VK_PRODUCTS = [
  { id: 1, name: "Kesar Mango", categoryId: "kesar-mango", category: "Kesar Mango", price: 120, oldPrice: 160, unit: "kg", rating: 5, reviews: 128, badge: "25% OFF", image: "assets/images/kesar-mango.jpg" },
  { id: 2, name: "Fresh Bananas", categoryId: "banana", category: "Banana", price: 40, oldPrice: 55, unit: "dozen", rating: 4, reviews: 86, badge: "Sale", image: "assets/images/banana.jpg" },
  { id: 3, name: "Farm Potatoes", categoryId: "potato", category: "Potato", price: 18, oldPrice: 25, unit: "kg", rating: 4, reviews: 64, badge: "Offer", image: "assets/images/potato.jpg" },
  { id: 4, name: "Red Onions", categoryId: "onion", category: "Onion", price: 30, oldPrice: 38, unit: "kg", rating: 4, reviews: 52, badge: "", image: "assets/images/red-onion.jpg" },
  { id: 5, name: "Ripe Tomatoes", categoryId: "tomato", category: "Tomato", price: 25, oldPrice: 35, unit: "kg", rating: 5, reviews: 73, badge: "Fresh", image: "assets/images/tomato.jpg" },
  { id: 6, name: "Green Spinach", categoryId: "green-vegetables", category: "Green Vegetables", price: 20, oldPrice: 28, unit: "bunch", rating: 4, reviews: 41, badge: "", image: "assets/images/green-vegetables.jpg" },
  { id: 7, name: "Fresh Apples", categoryId: "fruits", category: "Fruits", price: 140, oldPrice: 180, unit: "kg", rating: 5, reviews: 98, badge: "22% OFF", image: "assets/images/apples.jpg" },
  { id: 8, name: "Fresh Carrots", categoryId: "vegetables", category: "Vegetables", price: 35, oldPrice: 45, unit: "kg", rating: 4, reviews: 39, badge: "", image: "assets/images/carrots.jpg" },
];

/* ---------- Today's Rate List ---------- */
const VK_RATES = [
  { item: "Kesar Mango", unit: "1 kg", price: 120, trend: "down" },
  { item: "Banana", unit: "1 dozen", price: 40, trend: "up" },
  { item: "Potato", unit: "1 kg", price: 18, trend: "down" },
  { item: "Onion", unit: "1 kg", price: 30, trend: "up" },
  { item: "Tomato", unit: "1 kg", price: 25, trend: "down" },
  { item: "Green Spinach", unit: "1 bunch", price: 20, trend: "down" },
  { item: "Apple", unit: "1 kg", price: 140, trend: "up" },
  { item: "Carrot", unit: "1 kg", price: 35, trend: "down" },
];

/* ---------- Testimonials ---------- */
const VK_TESTIMONIALS = [
  { name: "Ramesh Patel", role: "Regular Customer", rating: 5, text: "Always fresh fruits and vegetables. The Kesar mangoes are the best in Gandhidham. Highly recommended!", img: "assets/images/testimonial-1.jpg" },
  { name: "Priya Shah", role: "Home Maker", rating: 5, text: "Great prices and quick WhatsApp ordering. The daily rate list helps me plan my shopping perfectly.", img: "assets/images/testimonial-2.jpg" },
  { name: "Amit Mehta", role: "Restaurant Owner", rating: 5, text: "I buy in bulk for my restaurant. Quality is consistent and delivery is always on time. Trustworthy mart.", img: "assets/images/testimonial-3.jpg" },
];

/* ---------- Gallery images ---------- */
const VK_GALLERY = [
  "assets/images/fresh-produce.jpg",
  "assets/images/grocery-store.jpg",
  "assets/images/fruit-basket.jpg",
  "assets/images/fruits.jpg",
  "assets/images/fruit-market.jpg",
  "assets/images/fruits-display.jpg",
];

/* Expose for non-module usage */
window.VK_CONFIG = VK_CONFIG;
window.VK_CATEGORIES = VK_CATEGORIES;
window.VK_PRODUCTS = VK_PRODUCTS;
window.VK_RATES = VK_RATES;
window.VK_TESTIMONIALS = VK_TESTIMONIALS;
window.VK_GALLERY = VK_GALLERY;
