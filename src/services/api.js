import axios from 'axios';

const JSONPLACEHOLDER = 'https://jsonplaceholder.typicode.com';

// ─── Smart base URL ────────────────────────────────────────────────────────
// In development (localhost) → call CoinGecko directly (no CORS issue)
// In production (Vercel)     → call our own proxy function (bypasses CORS)
const IS_DEV = import.meta.env.DEV;
const CG_BASE = IS_DEV
  ? 'https://api.coingecko.com/api/v3'
  : '/api/coingecko';

// Shared axios instance for CoinGecko / proxy
const cgClient = axios.create({
  baseURL: CG_BASE,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

// ─── API functions ─────────────────────────────────────────────────────────

export async function fetchCryptoPrices() {
  const res = await cgClient.get('/simple/price', {
    params: {
      ids: 'bitcoin,ethereum,solana,cardano,dogecoin',
      vs_currencies: 'usd',
      include_24hr_change: true,
      include_market_cap: true,
    },
  });
  return res.data;
}

export async function fetchCryptoChart(coin = 'bitcoin', days = 7) {
  const res = await cgClient.get(`/coins/${coin}/market_chart`, {
    params: { vs_currency: 'usd', days },
  });
  return res.data.prices.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price: Math.round(price),
  }));
}

export async function fetchGlobalStats() {
  const res = await cgClient.get('/global');
  return res.data.data;
}

export async function fetchTrending() {
  const res = await cgClient.get('/search/trending');
  return res.data.coins.slice(0, 6).map(c => c.item);
}

export async function fetchUsers() {
  const res = await axios.get(`${JSONPLACEHOLDER}/users`, { timeout: 8000 });
  return res.data;
}

export async function fetchPosts() {
  const res = await axios.get(`${JSONPLACEHOLDER}/posts?_limit=8`, { timeout: 8000 });
  return res.data;
}

export function generateRevenueData() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const monthIdx = (now.getMonth() - 11 + i + 12) % 12;
    const base = 45000 + Math.random() * 35000;
    const trend = i * 3200;
    return {
      month: months[monthIdx],
      revenue: Math.round(base + trend),
      expenses: Math.round((base + trend) * (0.45 + Math.random() * 0.15)),
      profit: Math.round((base + trend) * (0.28 + Math.random() * 0.12)),
    };
  });
}

export async function fetchDashboardData() {
  const [cryptos, global, trending, users, posts] = await Promise.allSettled([
    fetchCryptoPrices(),
    fetchGlobalStats(),
    fetchTrending(),
    fetchUsers(),
    fetchPosts(),
  ]);

  return {
    cryptos:  cryptos.status  === 'fulfilled' ? cryptos.value  : null,
    global:   global.status   === 'fulfilled' ? global.value   : null,
    trending: trending.status === 'fulfilled' ? trending.value : [],
    users:    users.status    === 'fulfilled' ? users.value    : [],
    posts:    posts.status    === 'fulfilled' ? posts.value    : [],
    revenue:  generateRevenueData(),
  };
}
