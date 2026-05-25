import { useState } from 'react';
import { useCryptoChart } from '../hooks/useDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './Markets.css';

const COINS = [
  { id: 'bitcoin', label: 'Bitcoin', symbol: 'BTC', color: '#fb923c' },
  { id: 'ethereum', label: 'Ethereum', symbol: 'ETH', color: '#63b3ed' },
  { id: 'solana', label: 'Solana', symbol: 'SOL', color: '#a78bfa' },
  { id: 'cardano', label: 'Cardano', symbol: 'ADA', color: '#34d399' },
  { id: 'dogecoin', label: 'Dogecoin', symbol: 'DOGE', color: '#f472b6' },
];

const PERIODS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export default function Markets({ data, loading }) {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [period, setPeriod] = useState(7);
  const { chartData, loading: chartLoading } = useCryptoChart(selectedCoin, period);
  const cryptos = data?.cryptos;
  const coinMeta = COINS.find(c => c.id === selectedCoin);

  return (
    <div className="markets-page fade-in">
      {/* Coin selector */}
      <div className="coin-tabs">
        {COINS.map(coin => {
          const price = cryptos?.[coin.id]?.usd;
          const change = cryptos?.[coin.id]?.usd_24h_change;
          const isSelected = selectedCoin === coin.id;
          return (
            <button
              key={coin.id}
              className={`coin-tab ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedCoin(coin.id)}
              style={isSelected ? { borderColor: coin.color, boxShadow: `0 0 20px ${coin.color}22` } : {}}
            >
              <div className="coin-tab-symbol" style={isSelected ? { color: coin.color } : {}}>{coin.symbol}</div>
              <div className="coin-tab-name">{coin.label}</div>
              {price && <div className="coin-tab-price">${price.toLocaleString()}</div>}
              {change !== undefined && (
                <div className={`coin-tab-change ${change >= 0 ? 'pos' : 'neg'}`}>
                  {change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {change.toFixed(2)}%
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Chart area */}
      <div className="chart-card markets-chart">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-title" style={{ color: coinMeta?.color }}>
              {coinMeta?.label} / USD
            </h3>
            <p className="chart-subtitle">Price history</p>
          </div>
          <div className="period-tabs">
            {PERIODS.map(p => (
              <button
                key={p.days}
                className={`period-btn ${period === p.days ? 'active' : ''}`}
                onClick={() => setPeriod(p.days)}
              >{p.label}</button>
            ))}
          </div>
        </div>
        {chartLoading ? (
          <div className="skeleton" style={{ height: 280 }} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toLocaleString()}`} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#111827', border: `1px solid ${coinMeta?.color}44`, borderRadius: 8, fontFamily: 'Syne', fontSize: 12 }}
                formatter={v => [`$${v.toLocaleString()}`, 'Price']}
              />
              <Line type="monotone" dataKey="price" stroke={coinMeta?.color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-title">Market Overview</h3>
        </div>
        <table className="market-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 14, width: '70%' }} /></td>
                  ))}
                </tr>
              ))
            ) : (
              COINS.map((coin, i) => {
                const price = cryptos?.[coin.id]?.usd;
                const change = cryptos?.[coin.id]?.usd_24h_change;
                const cap = cryptos?.[coin.id]?.usd_market_cap;
                return (
                  <tr key={coin.id} className={selectedCoin === coin.id ? 'selected' : ''} onClick={() => setSelectedCoin(coin.id)}>
                    <td className="rank">{i + 1}</td>
                    <td>
                      <div className="coin-name-cell">
                        <span className="coin-badge" style={{ background: `${coin.color}22`, color: coin.color }}>{coin.symbol}</span>
                        {coin.label}
                      </div>
                    </td>
                    <td className="price-cell">{price ? `$${price.toLocaleString()}` : '—'}</td>
                    <td>
                      {change !== undefined ? (
                        <span className={`change-badge ${change >= 0 ? 'pos' : 'neg'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="cap-cell">{cap ? `$${(cap / 1e9).toFixed(1)}B` : '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
