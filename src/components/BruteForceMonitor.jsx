import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  Flame, 
  Globe, 
  ShieldCheck, 
  Clock, 
  UserX, 
  TrendingUp, 
  Lock, 
  KeyRound,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { bruteForceData } from '../data/mockData';

export default function BruteForceMonitor({ onSay }) {
  const [totalAttempts, setTotalAttempts] = useState(bruteForceData.totalAttempts);
  const [last24Hours, setLast24Hours] = useState(bruteForceData.last24Hours);
  const [recentAttempts, setRecentAttempts] = useState(bruteForceData.recentAttempts);
  const [pulse, setPulse] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Live streaming attempt increment simulation (bursty nature of brute-force attacks)
  useEffect(() => {
    const interval = setInterval(() => {
      // 60% probability of an attack burst
      if (Math.random() > 0.4) {
        const addedAttempts = Math.floor(Math.random() * 7) + 1;
        setTotalAttempts(prev => prev + addedAttempts);
        setLast24Hours(prev => prev + addedAttempts);
        setPulse(true);
        setTimeout(() => setPulse(false), 400);

        // Occasionally push a new attempt to recent log
        if (Math.random() > 0.6) {
          const sampleIPs = ['185.220.101.5', '91.240.118.89', '45.155.205.12', '103.145.12.9'];
          const sampleUsers = ['root', 'admin', 'ubuntu', 'deploy', 'postgres'];
          const sampleCountries = ['China', 'Russia', 'Netherlands', 'Brazil'];
          const newAttempt = {
            ip: sampleIPs[Math.floor(Math.random() * sampleIPs.length)],
            username: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
            country: sampleCountries[Math.floor(Math.random() * sampleCountries.length)],
            timestamp: new Date().toTimeString().slice(0, 8),
            success: false,
            port: Math.random() > 0.5 ? 22 : 3389
          };
          setRecentAttempts(prev => [newAttempt, ...prev.slice(0, 9)]);
        }
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const maxAttempts = Math.max(...bruteForceData.attemptsByCountry.map(c => c.attempts));

  return (
    <div className="space-y-6">
      {/* Top Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Attempts Metric with Live Pulse */}
        <div className="panel flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Total Blocked Attempts</span>
            <div className={`w-2 h-2 rounded-full bg-signal-coral ${pulse ? 'scale-150 animate-ping' : ''}`} />
          </div>
          <div className="my-2">
            <span className={`font-mono text-3xl font-bold text-ink-primary transition-transform ${pulse ? 'scale-105 text-signal-coral' : ''}`}>
              {totalAttempts.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-ink-muted font-mono flex items-center gap-1">
            <Flame size={12} className="text-signal-coral" /> Rate: ~3.8 attempts/sec
          </span>
        </div>

        {/* 24-Hour Bursts */}
        <div className="panel flex flex-col justify-between">
          <span className="text-xs font-semibold text-ink-secondary">Attempts (24h Window)</span>
          <div className="my-2">
            <span className="font-mono text-3xl font-bold text-signal-amber">
              {last24Hours.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-signal-amber font-mono flex items-center gap-1">
            <TrendingUp size={12} /> +18.4% above baseline
          </span>
        </div>

        {/* Impossible Travel Flag */}
        <div className="panel flex flex-col justify-between border-signal-coral/20 bg-gradient-to-b from-white to-red-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-signal-coral flex items-center gap-1">
              <AlertTriangle size={13} /> Geo-Velocity Flags
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-signal-coral-light text-signal-coral">
              CRITICAL
            </span>
          </div>
          <div className="my-2">
            <span className="font-mono text-3xl font-bold text-signal-coral">
              2
            </span>
          </div>
          <span className="text-[11px] text-ink-muted">
            Admin account targeted from 2 distant ASNs in 90s
          </span>
        </div>

        {/* Success Rate: 0% */}
        <div className="panel flex flex-col justify-between">
          <span className="text-xs font-semibold text-ink-secondary">Breach Success Rate</span>
          <div className="my-2">
            <span className="font-mono text-3xl font-bold text-signal-emerald">
              0.00%
            </span>
          </div>
          <span className="text-[11px] text-signal-emerald font-mono flex items-center gap-1">
            <ShieldCheck size={12} /> 100% blocked at edge ACL
          </span>
        </div>
      </div>

      {/* Main Dual Grid: Country Distribution & Attack Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Breakdown with interactive progress bars */}
        <div className="panel">
          <header className="panel-heading">
            <div>
              <h2>Country of Origin Leaderboard</h2>
              <p>Top geographic sources of automated credential stuffing</p>
            </div>
            <span className="text-xs font-mono text-ink-muted">Top 6 Origins</span>
          </header>

          <div className="space-y-3.5 mt-2">
            {bruteForceData.attemptsByCountry.map((item, idx) => {
              const pct = ((item.attempts / maxAttempts) * 100).toFixed(0);
              const isSelected = selectedCountry === item.country;
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    setSelectedCountry(isSelected ? null : item.country);
                    onSay?.(`Filtered brute force telemetry for ${item.country}: ${item.attempts.toLocaleString()} total attempts.`);
                  }}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'bg-slate-100 ring-1 ring-slate-300' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-ink-primary flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.country}</span>
                    </span>
                    <span className="font-mono text-ink-secondary font-semibold">
                      {item.attempts.toLocaleString()} <span className="font-normal text-ink-muted">({pct}%)</span>
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700 bg-signal-coral"
                      style={{ 
                        width: `${pct}%`,
                        opacity: 0.75 + (idx === 0 ? 0.25 : 0)
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-ink-border flex items-center justify-between text-xs text-ink-muted">
            <span>Aggregated across 18 edge BGP peer nodes</span>
            <button 
              className="text-signal-blue hover:underline font-medium"
              onClick={() => onSay?.('BGP blackhole rules refreshed for top 6 countries.')}
            >
              Push ASN Blackhole
            </button>
          </div>
        </div>

        {/* Burst Activity Timeline (Histogram) */}
        <div className="panel">
          <header className="panel-heading">
            <div>
              <h2>Attack Burst Timeline (24h)</h2>
              <p>Security analysts monitor spike clusters vs steady background scans</p>
            </div>
            <span className="text-xs font-mono text-signal-coral font-bold bg-signal-coral-light px-2 py-0.5 rounded">
              Burst Spike Active
            </span>
          </header>

          {/* Histogram bar visualization */}
          <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-ink-border">
            {bruteForceData.trend.map((pt, i) => {
              const maxTrend = Math.max(...bruteForceData.trend.map(t => t.attempts));
              const heightPct = Math.round((pt.attempts / maxTrend) * 100);
              const isPeak = pt.attempts > 350;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                  <div className="relative w-full flex items-end justify-center h-32">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${
                        isPeak 
                          ? 'bg-signal-coral group-hover:bg-red-600' 
                          : 'bg-slate-300 group-hover:bg-slate-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-primary text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      {pt.attempts} reqs
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-ink-muted">
                    {pt.time}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <i className="w-2.5 h-2.5 rounded bg-signal-coral" /> Critical Spike (&gt;350)
              </span>
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <i className="w-2.5 h-2.5 rounded bg-slate-300" /> Background Noise
              </span>
            </div>
            <span className="font-mono text-[11px] text-ink-muted">Port 22 SSH: 74%</span>
          </div>
        </div>
      </div>

      {/* Live Stream Attempt Log */}
      <div className="panel">
        <header className="panel-heading">
          <div>
            <h2>Live Brute-Force Authentication Log</h2>
            <p>Recent failed authentication attempts intercepted by edge honeypots and bastion filters</p>
          </div>
          <span className="streaming">
            <em /> Intercepting real-time
          </span>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-border text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">SOURCE IP</th>
                <th className="py-2.5 px-3">TARGET USER</th>
                <th className="py-2.5 px-3">ORIGIN</th>
                <th className="py-2.5 px-3">PROTOCOL/PORT</th>
                <th className="py-2.5 px-3 text-right">RESPONSE ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-border">
              {recentAttempts.map((attempt, idx) => (
                <tr 
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSay?.(`Investigating IP: ${attempt.ip} (${attempt.country}). Automated edge block rule is ACTIVE.`)}
                >
                  <td className="py-2.5 px-3 font-mono text-ink-muted">{attempt.timestamp}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-ink-primary flex items-center gap-1.5">
                    <KeyRound size={13} className="text-signal-coral" />
                    {attempt.ip}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-ink-secondary">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {attempt.username}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-secondary">{attempt.country}</td>
                  <td className="py-2.5 px-3 font-mono text-ink-muted">
                    {attempt.port === 3389 ? 'RDP (3389)' : 'SSH (22)'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-signal-coral-light text-signal-coral">
                      BLOCKED & TARPIT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
