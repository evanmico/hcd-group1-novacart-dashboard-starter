/**
 * mockApi.js — Dummy data for building the frontend without the backend.
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

// Keeps rows whose "YYYY-MM" month falls inside the [start, end] date range.
function inRange(month, start, end) {
  if (start && month < start.slice(0, 7)) return false;
  if (end && month > end.slice(0, 7)) return false;
  return true;
}

// Share of the full year's revenue that falls inside [start, end] (0 to 1).
// Used to scale the city / product / customer dummy data with the date range.
function rangeShare(start, end) {
  const total = MONTHLY_ORDERS.reduce((sum, m) => sum + m.revenue, 0);
  const inside = MONTHLY_ORDERS
    .filter(m => inRange(m.month, start, end))
    .reduce((sum, m) => sum + m.revenue, 0);
  return inside / total;
}

// ── Monthly orders (2022) ────────────────────────────────────────────────────
const MONTHLY_ORDERS = [
  { month: '2022-01', month_name: 'Jan', order_count: 2100, revenue: 336000 },
  { month: '2022-02', month_name: 'Feb', order_count: 1950, revenue: 315900 },
  { month: '2022-03', month_name: 'Mar', order_count: 2300, revenue: 363400 },
  { month: '2022-04', month_name: 'Apr', order_count: 2400, revenue: 396000 },
  { month: '2022-05', month_name: 'May', order_count: 2550, revenue: 415650 },
  { month: '2022-06', month_name: 'Jun', order_count: 2450, revenue: 394450 },
  { month: '2022-07', month_name: 'Jul', order_count: 2500, revenue: 415000 },
  { month: '2022-08', month_name: 'Aug', order_count: 2650, revenue: 434600 },
  { month: '2022-09', month_name: 'Sep', order_count: 2600, revenue: 434200 },
  { month: '2022-10', month_name: 'Oct', order_count: 2600, revenue: 436800 },
  { month: '2022-11', month_name: 'Nov', order_count: 2900, revenue: 498800 },
  { month: '2022-12', month_name: 'Dec', order_count: 3000, revenue: 528000 },
];

// ── Revenue by city (sorted by revenue, descending) ──────────────────────────
const CITIES = [
  { city: 'New York',      state: 'NY', order_count: 3150, revenue: 524300 },
  { city: 'Los Angeles',   state: 'CA', order_count: 2870, revenue: 468900 },
  { city: 'Chicago',       state: 'IL', order_count: 2410, revenue: 391200 },
  { city: 'Houston',       state: 'TX', order_count: 2260, revenue: 362500 },
  { city: 'Phoenix',       state: 'AZ', order_count: 1980, revenue: 318700 },
  { city: 'Philadelphia',  state: 'PA', order_count: 1840, revenue: 297400 },
  { city: 'San Antonio',   state: 'TX', order_count: 1720, revenue: 276800 },
  { city: 'San Diego',     state: 'CA', order_count: 1650, revenue: 265100 },
  { city: 'Dallas',        state: 'TX', order_count: 1590, revenue: 254600 },
  { city: 'San Jose',      state: 'CA', order_count: 1480, revenue: 243900 },
  { city: 'Austin',        state: 'TX', order_count: 1390, revenue: 228300 },
  { city: 'Seattle',       state: 'WA', order_count: 1310, revenue: 216700 },
  { city: 'Denver',        state: 'CO', order_count: 1220, revenue: 199400 },
  { city: 'Boston',        state: 'MA', order_count: 1150, revenue: 189800 },
  { city: 'Atlanta',       state: 'GA', order_count: 1080, revenue: 176500 },
];

// ── Top products (sorted by revenue, descending) ─────────────────────────────
// Names, categories and values follow the Figma sample data.
const PRODUCTS = [
  { product_id: 'P001', name: 'Smart Scale Pro',  category: 'Health & Wellness', units_sold: 2240, revenue: 896000 },
  { product_id: 'P002', name: 'Pulse Watch Elite',category: 'Wearables',         units_sold: 1760, revenue: 739200 },
  { product_id: 'P003', name: 'DNA Kit Premium',  category: 'Diagnostics',       units_sold: 1680, revenue: 672000 },
  { product_id: 'P004', name: 'Care Plan Plus',   category: 'Services',          units_sold: 1400, revenue: 560000 },
  { product_id: 'P005', name: 'Heart Rate Band',  category: 'Wearables',         units_sold: 1120, revenue: 448000 },
  { product_id: 'P006', name: 'Sleep Monitor',    category: 'Health & Wellness', units_sold: 840,  revenue: 336000 },
  { product_id: 'P007', name: 'Nutrition Pack',   category: 'Supplements',       units_sold: 560,  revenue: 224000 },
  { product_id: 'P008', name: 'Home Test Kit',    category: 'Diagnostics',       units_sold: 280,  revenue: 112000 },
  { product_id: 'P009', name: 'Recovery Pack',    category: 'Supplements',       units_sold: 180,  revenue: 72000 },
  { product_id: 'P010', name: 'Starter Kit',      category: 'Services',          units_sold: 80,   revenue: 32000 },
];

// ── Top customers (sorted by total spent, descending) ────────────────────────
const CUSTOMERS = [
  { customer_id: 'C001', name: 'Olivia Martinez',  city: 'New York',     state: 'NY', total_orders: 74, total_spent: 12840.5 },
  { customer_id: 'C002', name: 'Liam Johnson',     city: 'Los Angeles',  state: 'CA', total_orders: 69, total_spent: 12115.25 },
  { customer_id: 'C003', name: 'Emma Williams',    city: 'Chicago',      state: 'IL', total_orders: 66, total_spent: 11672.0 },
  { customer_id: 'C004', name: 'Noah Brown',       city: 'Houston',      state: 'TX', total_orders: 63, total_spent: 11308.75 },
  { customer_id: 'C005', name: 'Ava Davis',        city: 'Phoenix',      state: 'AZ', total_orders: 61, total_spent: 10954.4 },
  { customer_id: 'C006', name: 'Ethan Garcia',     city: 'Philadelphia', state: 'PA', total_orders: 58, total_spent: 10521.9 },
  { customer_id: 'C007', name: 'Sophia Rodriguez', city: 'San Antonio',  state: 'TX', total_orders: 57, total_spent: 10287.15 },
  { customer_id: 'C008', name: 'Mason Wilson',     city: 'San Diego',    state: 'CA', total_orders: 55, total_spent: 9946.8 },
  { customer_id: 'C009', name: 'Isabella Anderson',city: 'Dallas',       state: 'TX', total_orders: 53, total_spent: 9702.35 },
  { customer_id: 'C010', name: 'Lucas Thomas',     city: 'San Jose',     state: 'CA', total_orders: 52, total_spent: 9488.6 },
  { customer_id: 'C011', name: 'Mia Taylor',       city: 'Austin',       state: 'TX', total_orders: 50, total_spent: 9215.0 },
  { customer_id: 'C012', name: 'Logan Moore',      city: 'Seattle',      state: 'WA', total_orders: 49, total_spent: 8974.45 },
  { customer_id: 'C013', name: 'Amelia Jackson',   city: 'Denver',       state: 'CO', total_orders: 47, total_spent: 8731.9 },
  { customer_id: 'C014', name: 'James Martin',     city: 'Boston',       state: 'MA', total_orders: 46, total_spent: 8512.3 },
  { customer_id: 'C015', name: 'Harper Lee',       city: 'Atlanta',      state: 'GA', total_orders: 44, total_spent: 8296.75 },
  { customer_id: 'C016', name: 'Benjamin Perez',   city: 'New York',     state: 'NY', total_orders: 43, total_spent: 8078.2 },
  { customer_id: 'C017', name: 'Evelyn Thompson',  city: 'Chicago',      state: 'IL', total_orders: 41, total_spent: 7864.55 },
  { customer_id: 'C018', name: 'Elijah White',     city: 'Los Angeles',  state: 'CA', total_orders: 40, total_spent: 7653.1 },
  { customer_id: 'C019', name: 'Abigail Harris',   city: 'Houston',      state: 'TX', total_orders: 38, total_spent: 7440.85 },
  { customer_id: 'C020', name: 'Henry Clark',      city: 'Seattle',      state: 'WA', total_orders: 37, total_spent: 7229.6 },
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
    total_revenue:    MONTHLY_ORDERS.reduce((sum, m) => sum + m.revenue, 0),
    total_orders:     MONTHLY_ORDERS.reduce((sum, m) => sum + m.order_count, 0),
    unique_customers: 400,
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
    revenue:     Math.round(c.revenue * share),
  })));
}

export async function getProducts(start, end) {
  const share = rangeShare(start, end);
  return respond(share === 0 ? [] : PRODUCTS.map(p => ({
    ...p,
    units_sold: Math.round(p.units_sold * share),
    revenue:    Math.round(p.revenue * share),
  })));
}

export async function getCustomers(start, end) {
  const share = rangeShare(start, end);
  return respond(share === 0 ? [] : CUSTOMERS
    .map(c => ({
      ...c,
      total_orders: Math.round(c.total_orders * share),
      total_spent:  Math.round(c.total_spent * share * 100) / 100,
    }))
    .filter(c => c.total_orders > 0));
}
