import React from 'react';
import { ShieldCheck, ChevronRight, Activity, Cpu, Server, Lock } from 'lucide-react';

export default function SystemPosture({ onSay }) {
  const subsystems = [
    {
      id: 'endpoint',
      icon: <Cpu size={15} />,
      label: 'Endpoint Protection',
      detail: '24 / 25 devices safe',
      status: 'safe',
      badge: 'Protected'
    },
    {
      id: 'firewall',
      icon: <Lock size={15} />,
      label: 'Edge Stateful Firewall',
      detail: 'BGP filter active',
      status: 'safe',
      badge: 'Nominal'
    },
    {
      id: 'dns',
      icon: <Activity size={15} />,
      label: 'DNS Sinkhole Sensor',
      detail: 'Zero rogue queries',
      status: 'safe',
      badge: 'Nominal'
    },
    {
      id: 'updates',
      icon: <Server size={15} />,
      label: 'OS & Firmware Patches',
      detail: 'Server-Main update pending',
      status: 'amber',
      badge: '1 Action'
    }
  ];

  // SVG circular arc calculation for 94%
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (94 / 100) * circumference;

  return (
    <article className="panel score-panel">
      <header className="panel-heading">
        <div>
          <h2>Security Posture</h2>
          <p>Multi-layer defense index and subsystem readiness</p>
        </div>
      </header>

      {/* Instrument Score Box */}
      <div className="posture-gauge-box">
        <div className="posture-score-display">
          <strong>
            94<span>/100</span>
          </strong>
          <p>
            <i /> High Posture Index
          </p>
          <span className="text-[11px] text-ink-muted mt-1 block">
            Passed 38 of 39 compliance checks
          </span>
        </div>

        {/* Circular Gauge Instrument */}
        <div className="instrument-gauge">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle
              className="gauge-bg"
              cx="36"
              cy="36"
              r={radius}
            />
            <circle
              className="gauge-fill"
              cx="36"
              cy="36"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-ink-primary">
            94%
          </span>
        </div>
      </div>

      {/* Subsystem Health Checklist */}
      <div className="health-list">
        {subsystems.map(sub => (
          <button
            key={sub.id}
            className="health-item text-left group"
            onClick={() => onSay?.(`${sub.label}: ${sub.detail} (${sub.badge}).`)}
          >
            <span className="min-w-0">
              <i className={sub.status} />
              <span className="truncate">
                <span className="font-medium text-ink-primary text-xs block">{sub.label}</span>
                <span className="text-[11px] text-ink-muted block">{sub.detail}</span>
              </span>
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                sub.status === 'safe' 
                  ? 'bg-signal-emerald-light text-signal-emerald' 
                  : 'bg-signal-amber-light text-signal-amber'
              }`}>
                {sub.badge}
              </span>
              <ChevronRight size={13} className="text-ink-muted group-hover:text-ink-primary transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </article>
  );
}
