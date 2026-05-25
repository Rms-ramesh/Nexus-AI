// api/coingecko.js — Vercel Serverless Function
// Acts as a proxy: Browser → This function → CoinGecko
// Bypasses CORS because server-to-server calls are unrestricted

export default async function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the path after /api/coingecko, e.g. "/simple/price"
  const { path = '', ...queryParams } = req.query;

  // Build the CoinGecko URL
  const cgPath = Array.isArray(path) ? path.join('/') : path;
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://api.coingecko.com/v3/${cgPath}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NexusAI-Dashboard/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `CoinGecko returned ${response.status}`,
      });
    }

    const data = await response.json();
    
    // Cache for 30 seconds on Vercel edge
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(data);

  } catch (error) {
    console.error('CoinGecko proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch from CoinGecko' });
  }
}
