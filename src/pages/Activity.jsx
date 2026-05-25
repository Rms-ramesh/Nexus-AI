import { MessageSquare, User, Clock } from 'lucide-react';
import './Activity.css';

export default function Activity({ data, loading }) {
  const posts = data?.posts || [];
  const users = data?.users || [];

  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown User';

  const ACTIVITY_TYPES = ['created', 'updated', 'commented on', 'deleted', 'shared', 'reviewed', 'approved', 'deployed'];
  const ICONS = ['📝', '✏️', '💬', '🗑️', '📤', '👀', '✅', '🚀'];

  const timeAgo = (id) => {
    const mins = id * 7 + 3;
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div className="activity-page fade-in">
      <div className="activity-header">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-filter">
          {['All', 'Posts', 'Users', 'System'].map(f => (
            <button key={f} className={`filter-btn ${f === 'All' ? 'active' : ''}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="activity-layout">
        <div className="activity-feed">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="activity-item">
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 4 }} />
                  <div className="skeleton" style={{ height: 11, width: '30%' }} />
                </div>
              </div>
            ))
          ) : posts.map((post, i) => {
            const type = ACTIVITY_TYPES[i % ACTIVITY_TYPES.length];
            const icon = ICONS[i % ICONS.length];
            const userName = getUserName(post.userId);
            return (
              <div key={post.id} className="activity-item fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="activity-icon-wrap">
                  <span className="activity-emoji">{icon}</span>
                </div>
                <div className="activity-body">
                  <div className="activity-title">
                    <span className="activity-user">{userName}</span>
                    {' '}{type}{' '}
                    <span className="activity-subject">"{post.title.split(' ').slice(0, 4).join(' ')}..."</span>
                  </div>
                  <div className="activity-body-text">{post.body.substring(0, 80)}...</div>
                  <div className="activity-meta">
                    <Clock size={10} />
                    {timeAgo(post.id)}
                    <span className="meta-sep">·</span>
                    <span>Post #{post.id}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="activity-sidebar">
          <div className="chart-card">
            <h3 className="chart-title" style={{ marginBottom: 16 }}>Top Contributors</h3>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 40, borderRadius: 8, marginBottom: 8 }} />
              ))
            ) : users.slice(0, 6).map((user, i) => (
              <div key={user.id} className="contributor-item">
                <div className="contributor-rank">#{i + 1}</div>
                <div className="user-avatar-sm" style={{ background: `hsl(${user.id * 36}, 60%, 45%)`, width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                  {user.name.charAt(0)}
                </div>
                <div className="contributor-info">
                  <div className="contributor-name">{user.name}</div>
                  <div className="contributor-actions">{Math.floor(Math.random() * 40 + 10)} actions</div>
                </div>
                <div className="contributor-bar-wrap">
                  <div className="contributor-bar" style={{ width: `${100 - i * 14}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="chart-card" style={{ marginTop: 16 }}>
            <h3 className="chart-title" style={{ marginBottom: 12 }}>Activity Summary</h3>
            {[
              { label: 'Posts Created', val: 8, color: 'var(--accent-cyan)' },
              { label: 'Users Active', val: 7, color: 'var(--accent-green)' },
              { label: 'Updates', val: 14, color: 'var(--accent-blue)' },
              { label: 'Reviews', val: 3, color: 'var(--accent-purple)' },
            ].map(item => (
              <div key={item.label} className="summary-row">
                <span className="summary-label">{item.label}</span>
                <div className="summary-bar-wrap">
                  <div className="summary-bar" style={{ width: `${(item.val / 15) * 100}%`, background: item.color }} />
                </div>
                <span className="summary-val" style={{ color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
