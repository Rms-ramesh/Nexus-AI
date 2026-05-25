import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Markets from './pages/Markets';
import Users from './pages/Users';
import Activity from './pages/Activity';
import { useDashboard } from './hooks/useDashboard';
import './App.css';

const PAGE_META = {
  overview: { title: 'Dashboard Overview', subtitle: 'Real-time metrics & insights' },
  analytics: { title: 'Analytics', subtitle: 'Performance breakdown & trends' },
  markets: { title: 'Crypto Markets', subtitle: 'Live prices powered by CoinGecko API' },
  portfolio: { title: 'Portfolio', subtitle: 'Your holdings & performance' },
  users: { title: 'Users', subtitle: 'Powered by JSONPlaceholder API' },
  activity: { title: 'Activity Feed', subtitle: 'Recent actions & events' },
  settings: { title: 'Settings', subtitle: 'Configure your workspace' },
};

function Placeholder({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
      <div style={{ fontSize: 48 }}>🔧</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Coming soon · Work in progress</div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const { data, loading, error, refetch, lastUpdated } = useDashboard();
  const meta = PAGE_META[activePage] || PAGE_META.overview;

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <Overview data={data} loading={loading} />;
      case 'analytics': return <Analytics data={data} loading={loading} />;
      case 'markets': return <Markets data={data} loading={loading} />;
      case 'users': return <Users data={data} loading={loading} />;
      case 'activity': return <Activity data={data} loading={loading} />;
      default: return <Placeholder title={meta.title} />;
    }
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onRefresh={refetch}
          loading={loading}
          lastUpdated={lastUpdated}
        />
        <div className="page-content">
          {error && (
            <div className="error-banner">
              ⚠️ Some data unavailable. Showing cached/fallback data.
            </div>
          )}
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
