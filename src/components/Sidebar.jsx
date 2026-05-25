import { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Users, BarChart3,
  Settings, Bell, Search, ChevronRight, Zap,
  Activity, Wallet, Globe, LogOut, Menu, X
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'markets', label: 'Markets', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'activity', label: 'Activity', icon: Activity },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Sign Out', icon: LogOut },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><Zap size={16} /></div>
            {!collapsed && <span className="logo-text">NexusAI</span>}
          </div>
          <button className="collapse-btn" onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}>
            {mobileOpen ? <X size={16} /> : <ChevronRight size={16} className={collapsed ? '' : 'rotated'} />}
          </button>
        </div>

        <div className="sidebar-search">
          {!collapsed && (
            <div className="search-box">
              <Search size={14} />
              <input placeholder="Search..." readOnly />
              <kbd>⌘K</kbd>
            </div>
          )}
          {collapsed && <div className="search-icon-only"><Search size={16} /></div>}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">{!collapsed && 'MAIN MENU'}</div>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => { onNavigate(id); setMobileOpen(false); }}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && activePage === id && <div className="active-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-label">{!collapsed && 'ACCOUNT'}</div>
          {BOTTOM_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${id === 'logout' ? 'logout' : ''}`} onClick={() => onNavigate(id)}>
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}

          {!collapsed && (
            <div className="user-card">
              <div className="user-avatar">JD</div>
              <div className="user-info">
                <div className="user-name">John Doe</div>
                <div className="user-role">Admin · Pro Plan</div>
              </div>
              <div className="user-status" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
