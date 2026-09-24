import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ 
  label, 
  value, 
  note, 
  icon, 
  tone = 'safe', 
  urgent = false, 
  trend = null,
  onClick 
}) {
  const waves = [5, 11, 7, 16, 9, 19, 13, 17];

  return (
    <button 
      className={`metric ${tone} ${urgent ? 'coral ring-1 ring-signal-coral/30' : ''}`}
      onClick={onClick}
    >
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <div className="metric-icon">
          {icon}
        </div>
      </div>

      <div className="metric-value">
        {value}
      </div>

      <div className="metric-note">
        {trend && (
          <span className={`inline-flex items-center text-xs font-mono font-semibold ${
            trend.type === 'up' ? 'text-signal-coral' : 'text-signal-emerald'
          }`}>
            {trend.type === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend.value}
          </span>
        )}
        <span>{note}</span>

        {/* Wave indicator */}
        <i className="metric-wave">
          {waves.map((h, i) => (
            <b key={i} style={{ height: h }} />
          ))}
        </i>
      </div>
    </button>
  );
}
