import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

export default function StatCard({ title, value, change, changeLabel, icon: Icon, color, loading, prefix = '', suffix = '' }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  if (loading) {
    return (
      <div className="stat-card">
        <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 32, width: '80%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '40%' }} />
      </div>
    );
  }

  return (
    <div className={`stat-card stat-card--${color || 'blue'}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className={`stat-icon stat-icon--${color || 'blue'}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="stat-value">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      {change !== undefined && (
        <div className={`stat-change ${isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'}`}>
          {isPositive ? <TrendingUp size={12} /> : isNeutral ? <Minus size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? '+' : ''}{typeof change === 'number' ? change.toFixed(2) : change}%</span>
          {changeLabel && <span className="change-label">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
