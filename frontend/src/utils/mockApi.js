/**
 * mockApi.js — Dummy data for building the frontend without the backend.
 *
 * The figures below were taken from the real Gold database (data/novacart_gold.db)
 * for orders with status 'delivered' or 'shipped', so the dashboard looks like it
 * will with live data. The full-year values are exact; when a shorter date range
 * is selected, city / product / customer figures are scaled by that range's share
 * of yearly revenue (an approximation, since the real API recalculates them).
 *
 * Exports the same function names and response shapes as api.js.
 * Pages never import this directly; utils/dataSource.js picks mockApi or api.js
 * based on REACT_APP_USE_MOCK.
 */

const DELAY_MS = 300;

// Simulates network latency so loading states are visible.
function respond(data) {
  return new Promise(resolve => setTimeout(() => resolve(data), DELAY_MS));
}

const round2 = (n) => Math.round(n * 100) / 100;

// Keeps rows whose "YYYY-MM" month falls inside the [start, end] date range.
function inRange(month, start, end) {
  if (start && month < start.slice(0, 7)) return false;
  if (end && month > end.slice(0, 7)) return false;
  return true;
}

// Share of the full year's revenue that falls inside [start, end] (0 to 1).
function rangeShare(start, end) {
  const total = MONTHLY_ORDERS.reduce((sum, m) => sum + m.revenue, 0);
  const inside = MONTHLY_ORDERS
    .filter(m => inRange(m.month, start, end))
    .reduce((sum, m) => sum + m.revenue, 0);
  return inside / total;
}

// ── Monthly orders (2022) — same shape as GET /franchise/orders ──────────────
const MONTHLY_ORDERS = [
  { month: '2022-01', month_name: 'January',   order_count: 1514, revenue: 289570.84 },
  { month: '2022-02', month_name: 'February',  order_count: 1292, revenue: 241617.4 },
  { month: '2022-03', month_name: 'March',     order_count: 1462, revenue: 259485.78 },
  { month: '2022-04', month_name: 'April',     order_count: 1434, revenue: 274340.23 },
  { month: '2022-05', month_name: 'May',       order_count: 1441, revenue: 266895.76 },
  { month: '2022-06', month_name: 'June',      order_count: 1426, revenue: 266620.52 },
  { month: '2022-07', month_name: 'July',      order_count: 1485, revenue: 279386.02 },
  { month: '2022-08', month_name: 'August',    order_count: 1391, revenue: 263310.27 },
  { month: '2022-09', month_name: 'September', order_count: 1383, revenue: 266701.81 },
  { month: '2022-10', month_name: 'October',   order_count: 1422, revenue: 272937.91 },
  { month: '2022-11', month_name: 'November',  order_count: 1351, revenue: 263046.54 },
  { month: '2022-12', month_name: 'December',  order_count: 1482, revenue: 275090.44 },
];

// ── Revenue by city (sorted by revenue, descending) — the 10 real cities ─────
const CITIES = [
  { city: 'Phoenix',   state: 'AZ', order_count: 2236, revenue: 405489.38 },
  { city: 'Miami',     state: 'FL', order_count: 1791, revenue: 339173.47 },
  { city: 'Austin',    state: 'TX', order_count: 1774, revenue: 332136.99 },
  { city: 'Chicago',   state: 'IL', order_count: 1676, revenue: 325981.52 },
  { city: 'Portland',  state: 'OR', order_count: 1699, revenue: 319876.68 },
  { city: 'Nashville', state: 'TN', order_count: 1746, revenue: 317750.47 },
  { city: 'Atlanta',   state: 'GA', order_count: 1639, revenue: 312622.83 },
  { city: 'Denver',    state: 'CO', order_count: 1629, revenue: 303670.59 },
  { city: 'Seattle',   state: 'WA', order_count: 1527, revenue: 294428.52 },
  { city: 'Boston',    state: 'MA', order_count: 1366, revenue: 267873.07 },
];

// ── Products (sorted by revenue, descending). All 15 real products; ─────────
// getProducts() returns only the top 10, like the real endpoint.
const PRODUCTS = [
  { product_id: 'P004', name: '27" Monitor',              category: 'Electronics', units_sold: 2841, revenue: 849459.0 },
  { product_id: 'P002', name: 'Mechanical Keyboard',      category: 'Electronics', units_sold: 2854, revenue: 369593.0 },
  { product_id: 'P008', name: 'Portable SSD 1TB',         category: 'Storage',     units_sold: 2962, revenue: 325790.38 },
  { product_id: 'P011', name: 'Noise Cancelling Earbuds', category: 'Electronics', units_sold: 2957, revenue: 295670.43 },
  { product_id: 'P001', name: 'Wireless Headphones',      category: 'Electronics', units_sold: 2844, revenue: 255931.56 },
  { product_id: 'P006', name: 'Webcam HD',                category: 'Electronics', units_sold: 2812, revenue: 224931.88 },
  { product_id: 'P009', name: 'Smart Speaker',            category: 'Electronics', units_sold: 2842, revenue: 170491.58 },
  { product_id: 'P010', name: 'Ergonomic Mouse',          category: 'Electronics', units_sold: 2880, revenue: 158371.2 },
  { product_id: 'P005', name: 'Laptop Stand',             category: 'Accessories', units_sold: 2828, revenue: 141371.72 },
  { product_id: 'P014', name: 'Monitor Light Bar',        category: 'Accessories', units_sold: 2813, revenue: 112491.87 },
  { product_id: 'P013', name: 'USB Hub 7-port',           category: 'Electronics', units_sold: 3005, revenue: 105144.95 },
  { product_id: 'P012', name: 'Desk Organizer',           category: 'Accessories', units_sold: 2845, revenue: 71096.55 },
  { product_id: 'P007', name: 'Mouse Pad XL',             category: 'Accessories', units_sold: 2693, revenue: 53833.07 },
  { product_id: 'P015', name: 'Cable Management Kit',     category: 'Accessories', units_sold: 2867, revenue: 42976.33 },
  { product_id: 'P003', name: 'USB-C Cable 2m',           category: 'Accessories', units_sold: 2790, revenue: 41850.0 },
];

// ── Top 20 customers (sorted by total spent, descending) ─────────────────────
const CUSTOMERS = [
  { customer_id: 'C093', name: 'Emma López',     city: 'Boston',   state: 'MA', total_orders: 63, total_spent: 13267.82 },
  { customer_id: 'C009', name: 'Alice Andersen', city: 'Phoenix',  state: 'AZ', total_orders: 56, total_spent: 12817.78 },
  { customer_id: 'C353', name: 'Rosa López',     city: 'Miami',    state: 'FL', total_orders: 59, total_spent: 12727.81 },
  { customer_id: 'C159', name: 'Hannah Kim',     city: 'Seattle',  state: 'WA', total_orders: 50, total_spent: 12357.28 },
  { customer_id: 'C040', name: 'Bob Dubois',     city: 'Seattle',  state: 'WA', total_orders: 37, total_spent: 12345.27 },
  { customer_id: 'C371', name: 'Samuel Nguyen',  city: 'Portland', state: 'OR', total_orders: 51, total_spent: 12340.42 },
  { customer_id: 'C252', name: 'Miguel Rossi',   city: 'Phoenix',  state: 'AZ', total_orders: 53, total_spent: 12095.47 },
  { customer_id: 'C275', name: 'Nadia Ali',      city: 'Portland', state: 'OR', total_orders: 45, total_spent: 11937.07 },
  { customer_id: 'C219', name: 'Kevin Kim',      city: 'Seattle',  state: 'WA', total_orders: 54, total_spent: 11810.87 },
  { customer_id: 'C253', name: 'Miguel López',   city: 'Boston',   state: 'MA', total_orders: 49, total_spent: 11765.18 },
  { customer_id: 'C397', name: 'Tina Martin',    city: 'Seattle',  state: 'WA', total_orders: 52, total_spent: 11731.35 },
  { customer_id: 'C193', name: 'Julia López',    city: 'Chicago',  state: 'IL', total_orders: 46, total_spent: 11628.56 },
  { customer_id: 'C311', name: 'Priya Nguyen',   city: 'Chicago',  state: 'IL', total_orders: 55, total_spent: 11559.5 },
  { customer_id: 'C211', name: 'Kevin Nguyen',   city: 'Phoenix',  state: 'AZ', total_orders: 62, total_spent: 11553.53 },
  { customer_id: 'C210', name: 'Kevin Patel',    city: 'Portland', state: 'OR', total_orders: 50, total_spent: 11500.49 },
  { customer_id: 'C257', name: 'Miguel Martin',  city: 'Chicago',  state: 'IL', total_orders: 56, total_spent: 11358.41 },
  { customer_id: 'C263', name: 'Nadia García',   city: 'Miami',    state: 'FL', total_orders: 54, total_spent: 11357.89 },
  { customer_id: 'C117', name: 'Fatima Martin',  city: 'Chicago',  state: 'IL', total_orders: 44, total_spent: 11285.63 },
  { customer_id: 'C378', name: 'Samuel Santos',  city: 'Boston',   state: 'MA', total_orders: 51, total_spent: 11204.4 },
  { customer_id: 'C073', name: 'Diana López',    city: 'Chicago',  state: 'IL', total_orders: 51, total_spent: 11157.08 },
];

// ── API-compatible exports ───────────────────────────────────────────────────
export async function authorize() {
  return respond({ user: 'dev_user', status: 'authorized' });
}

export async function getHealth() {
  return respond({ status: 'healthy', database: { status: 'connected' } });
}

// Like the real /franchise/summary: all-time totals, not filtered by date.
// (The pages compute date-range totals from getOrders instead.)
export async function getSummary() {
  return respond({
    total_revenue:    round2(MONTHLY_ORDERS.reduce((sum, m) => sum + m.revenue, 0)),
    total_orders:     MONTHLY_ORDERS.reduce((sum, m) => sum + m.order_count, 0),
    unique_customers: 400,
    date_range:       { start: '2022-01-01', end: '2022-12-31' },
  });
}

export async function getOrders(start, end) {
  return respond(MONTHLY_ORDERS.filter(m => inRange(m.month, start, end)));
}

export async function getCities(start, end) {
  const share = rangeShare(start, end);
  return respond(share === 0 ? [] : CITIES.map(c => ({
    ...c,
    order_count: Math.round(c.order_count * share),
    revenue:     round2(c.revenue * share),
  })));
}

export async function getProducts(start, end) {
  const share = rangeShare(start, end);
  return respond(share === 0 ? [] : PRODUCTS
    .map(p => ({
      ...p,
      units_sold: Math.round(p.units_sold * share),
      revenue:    round2(p.revenue * share),
    }))
    .slice(0, 10));
}

export async function getCustomers(start, end) {
  const share = rangeShare(start, end);
  return respond(share === 0 ? [] : CUSTOMERS
    .map(c => ({
      ...c,
      total_orders: Math.round(c.total_orders * share),
      total_spent:  round2(c.total_spent * share),
    }))
    .filter(c => c.total_orders > 0));
}
