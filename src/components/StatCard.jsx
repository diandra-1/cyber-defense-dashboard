import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { appleSprings } from '../lib/fluidMotion';
import { audioEngine } from '../lib/audioEngine';
import NumberTicker from './ui/NumberTicker';

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
  const waves = [6, 12, 8, 18, 10, 20, 14, 16];
  const isNumeric = typeof value === 'number' || (!isNaN(parseFloat(value)) && !String(value).includes('/'));

  const handleClick = (e) => {
    audioEngine.tick(0.04);
    onClick?.(e);
  };

  return (
    <motion.button 
      whileHover={appleSprings.hoverElevate}
      whileTap={appleSprings.tapPress}
      className={`metric ${tone} ${urgent ? 'coral ring-1 ring-red-500/40' : ''}`}
      onClick={handleClick}
    >
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <div className="metric-icon">
          {icon}
        </div>
      </div>

      <div className="metric-value font-mono">
        {isNumeric ? (
          <NumberTicker value={value} />
        ) : (
          value
        )}
      </div>

      <div className="metric-note">
        {trend && (
          <span className={`inline-flex items-center text-xs font-mono font-semibold ${
            trend.type === 'up' 
              ? 'text-signal-coral' 
              : trend.type === 'down'
              ? 'text-emerald-400'
              : 'text-slate-400'
          }`}>
            {trend.type === 'up' ? <ArrowUpRight size={13} /> : trend.type === 'down' ? <ArrowDownRight size={13} /> : null}
            {trend.value}
          </span>
        )}
        <span className="text-slate-400">{note}</span>

        {/* Wave indicator */}
        <i className="metric-wave">
          {waves.map((h, i) => (
            <b key={i} style={{ height: h }} />
          ))}
        </i>
      </div>
    </motion.button>
  );
}
