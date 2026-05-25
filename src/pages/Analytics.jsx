import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter
} from 'recharts';
import './Analytics.css';

const METRICS = [
  { subject: 'Revenue', A: 88, fullMark: 100 },
  { subject: 'Users', A: 74, fullMark: 100 },
  { subject: 'Engagement', A: 92, fullMark: 100 },
  { subject: 'Retention', A: 65, fullMark: 100 },
  { subject: 'NPS', A: 78, fullMark: 100 },
  { subject: 'Conversion', A: 55, fullMark: 100 },
];

const SCATTER_DATA = Array.from({ length: 30 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 40 + 10,
}));

export default function Analytics({ data, loading }) {
  const revenue = data?.revenue || [];

  const kpis = [
    { label: 'Avg Session', value: '4m 32s', change: '+12%', color: 'var(--accent-cyan)' },
    { label: 'Bounce Rate', value: '24.3%', change: '-3.1%', color: 'var(--accent-green)' },
    { label: 'Conversion', value: '5.8%', change: '+0.9%', color: 'var(--accent-purple)' },
    { label: 'DAU', value: '12,450', change: '+18%', color: 'var(--accent-orange)' },
  ];

  return (
    <div className="analytics-page fade-in">
      <div className="analytics-kpis">
        {kpis.map((k, i) => (
          <div className="kpi-card fade-in" key={k.label} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className={`kpi-change ${k.change.startsWith('+') ? 'pos' : 'neg'}`}>{k.change}</div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        <div className="chart-card fade-in-delay-1">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Revenue vs Profit</h3>
              <p className="chart-subtitle">Bars = revenue, Line = profit margin</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={revenue} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontFamily: 'Syne', fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="revenue" fill="rgba(34,211,238,0.5)" radius={[3,3,0,0]} name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#a78bfa" strokeWidth={2} dot={false} name="Profit" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in-delay-2">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Performance Radar</h3>
              <p className="chart-subtitle">Core metric scores</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={METRICS}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#8ba3c4', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <Radar name="Score" dataKey="A" stroke="var(--accent-cyan)" fill="var(--accent-cyan)" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontFamily: 'Syne', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card fade-in-delay-3">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-title">User Engagement Scatter</h3>
            <p className="chart-subtitle">Session duration vs. page views (bubble = conversion score)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="x" name="Session (s)" tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="y" name="Pages" tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontFamily: 'Syne', fontSize: 12 }} />
            <Scatter data={SCATTER_DATA} fill="var(--accent-blue)" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
