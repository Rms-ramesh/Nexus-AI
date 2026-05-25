import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData, fetchCryptoChart } from '../services/api';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchDashboardData();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [load]);

  return { data, loading, error, refetch: load, lastUpdated };
}

export function useCryptoChart(coin, days) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCryptoChart(coin, days)
      .then(d => { setChartData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [coin, days]);

  return { chartData, loading };
}
