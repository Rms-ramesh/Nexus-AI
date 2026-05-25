import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, Users, TrendingUp, Activity, Bitcoin, Globe } from 'lucide-react';
import StatCard from '../components/StatCard';
import './Overview.css';

const COLORS = ['#22d3ee', '#63b3ed', '#a78bfa', '#f472b6', '#34d399'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="tooltip-row">
            <span style={{ color: p.color }}>{p.name}</span>
            <span>${p.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview({ data, loading }) {
  const cryptos = data?.cryptos;
  const global = data?.global;
  const revenue = data?.revenue || [];
  const trending = data?.trending || [];

  const btcPrice = cryptos?.bitcoin?.usd;
  const ethPrice = cryptos?.ethereum?.usd;
  const btcChange = cryptos?.bitcoin?.usd_24h_change;
  const totalMarketCap = global?.total_market_cap?.usd;
  const marketCapChange = global?.market_cap_change_percentage_24h_usd;
  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0);
  const lastMonthRevenue = revenue[revenue.length - 1]?.revenue || 0;
  const prevMonthRevenue = revenue[revenue.length - 2]?.revenue || 1;
  const revenueGrowth = ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;

  // Pie data for market dominance
  const dominanceData = global ? [
    { name: 'Bitcoin', value: Math.round(global.market_cap_percentage?.btc || 42) },
    { name: 'Ethereum', value: Math.round(global.market_cap_percentage?.eth || 18) },
    { name: 'Others', value: Math.round(100 - (global.market_cap_percentage?.btc || 42) - (global.market_cap_percentage?.eth || 18)) },
  ] : [
    { name: 'Bitcoin', value: 42 },
    { name: 'Ethereum', value: 18 },
    { name: 'Others', value: 40 },
  ];

  return (
    <div className="overview-page fade-in">
      {/* KPI Cards */}
      <section className="stats-grid">
        <StatCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change={revenueGrowth}
          changeLabel="vs last month"
          icon={DollarSign}
          color="cyan"
          loading={loading}
        />
        <StatCard
          title="Bitcoin Price"
          value={btcPrice ? `$${btcPrice.toLocaleString()}` : '—'}
          change={btcChange}
          changeLabel="24h"
          icon={Bitcoin}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Market Cap"
          value={totalMarketCap ? `$${(totalMarketCap / 1e12).toFixed(2)}T` : '—'}
          change={marketCapChange}
          changeLabel="24h"
          icon={Globe}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Ethereum"
          value={ethPrice ? `$${ethPrice.toLocaleString()}` : '—'}
          change={cryptos?.ethereum?.usd_24h_change}
          changeLabel="24h"
          icon={TrendingUp}
          color="blue"
          loading={loading}
        />
      </section>

      {/* Charts Row */}
      <section className="charts-row">
        <div className="chart-card chart-card--wide fade-in-delay-1">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Revenue Overview</h3>
              <p className="chart-subtitle">Monthly revenue, expenses & profit</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: 'var(--accent-cyan)' }} />Revenue
              <span className="legend-dot" style={{ background: 'var(--accent-orange)' }} />Expenses
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenue} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4a6080', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#fb923c" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in-delay-2">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Market Dominance</h3>
              <p className="chart-subtitle">Share by market cap</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={dominanceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {dominanceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontFamily: 'Syne' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {dominanceData.map((d, i) => (
              <div key={i} className="pie-legend-row">
                <span className="legend-dot" style={{ background: COLORS[i] }} />
                <span className="legend-name">{d.name}</span>
                <span className="legend-val">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending + Activity */}
      <section className="bottom-row">
        <div className="chart-card fade-in-delay-3">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">🔥 Trending Coins</h3>
              <p className="chart-subtitle">Top trending on CoinGecko</p>
            </div>
          </div>
          <div className="trending-list">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8, marginBottom: 6 }} />
              ))
            ) : trending.length > 0 ? trending.map((coin, i) => (
              <div key={coin.id} className="trending-item">
                <div className="trending-rank">#{i + 1}</div>
                <img src={coin.small} alt={coin.name} className="trending-thumb" onError={e => e.target.style.display='none'} />
                <div className="trending-info">
                  <div className="trending-name">{coin.name}</div>
                  <div className="trending-symbol">{coin.symbol}</div>
                </div>
                <div className="trending-score">
                  Score: {coin.score + 1}
                </div>
              </div>
            )) : (
              <div className="empty-state">No trending data available</div>
            )}
          </div>
        </div>

        <div className="chart-card fade-in-delay-4">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Monthly Profit</h3>
              <p className="chart-subtitle">Net profit per month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenue.slice(-6)} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4a6080', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="profit" fill="var(--accent-cyan)" radius={[4,4,0,0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
