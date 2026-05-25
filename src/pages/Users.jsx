import { useState } from 'react';
import { Search, Mail, Phone, MapPin, ExternalLink, UserCheck } from 'lucide-react';
import './Users.css';

export default function Users({ data, loading }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const users = data?.users || [];

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const ROLES = ['Admin', 'Editor', 'Viewer', 'Manager', 'Developer', 'Analyst', 'Designer', 'Support', 'Guest', 'Owner'];
  const STATUSES = ['Active', 'Active', 'Active', 'Idle', 'Active', 'Away', 'Active', 'Active', 'Inactive', 'Active'];

  return (
    <div className="users-page fade-in">
      <div className="users-header">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            className="users-search"
            placeholder="Search users, email, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="users-meta">
          <UserCheck size={14} />
          <span>{filtered.length} users</span>
        </div>
      </div>

      <div className="users-grid-layout">
        <div className="users-table-wrap chart-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Company</th>
                <th>Status</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: '80%' }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((user, i) => {
                const status = STATUSES[i] || 'Active';
                return (
                  <tr key={user.id} className={selected?.id === user.id ? 'selected' : ''} onClick={() => setSelected(user)}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm" style={{ background: `hsl(${user.id * 36}, 60%, 45%)` }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="role-badge">{ROLES[i] || 'User'}</span></td>
                    <td className="company-cell">{user.company?.name}</td>
                    <td>
                      <span className={`status-dot-label status--${status.toLowerCase()}`}>
                        <span className="status-dot" />
                        {status}
                      </span>
                    </td>
                    <td className="city-cell">{user.address?.city}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="user-detail-card chart-card fade-in">
            <div className="detail-header">
              <div className="detail-avatar" style={{ background: `hsl(${selected.id * 36}, 60%, 45%)` }}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <div className="detail-name">{selected.name}</div>
                <div className="detail-username">@{selected.username}</div>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="detail-fields">
              <div className="detail-field">
                <Mail size={13} />
                <a href={`mailto:${selected.email}`}>{selected.email}</a>
              </div>
              <div className="detail-field">
                <Phone size={13} />
                <span>{selected.phone}</span>
              </div>
              <div className="detail-field">
                <MapPin size={13} />
                <span>{selected.address?.city}, {selected.address?.zipcode}</span>
              </div>
              <div className="detail-field">
                <ExternalLink size={13} />
                <a href={`https://${selected.website}`} target="_blank" rel="noreferrer">{selected.website}</a>
              </div>
            </div>
            <div className="detail-company">
              <div className="detail-company-name">{selected.company?.name}</div>
              <div className="detail-company-bs">{selected.company?.bs}</div>
              <div className="detail-company-catch">"{selected.company?.catchPhrase}"</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
