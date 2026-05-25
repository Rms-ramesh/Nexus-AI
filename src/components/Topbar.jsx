import { Bell, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import './Topbar.css';

export default function Topbar({ title, subtitle, onRefresh, loading, lastUpdated }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="topbar-right">
        {timeStr && (
          <div className="last-updated">
            <Wifi size={12} className="live-icon" />
            <span>Live · {timeStr}</span>
          </div>
        )}
        <button className={`refresh-btn ${loading ? 'spinning' : ''}`} onClick={onRefresh} disabled={loading}>
          <RefreshCw size={15} />
        </button>
        <div className="notif-btn">
          <Bell size={16} />
          <div className="notif-badge">3</div>
        </div>
        <div className="topbar-avatar">JD</div>
      </div>
    </header>
  );
}
