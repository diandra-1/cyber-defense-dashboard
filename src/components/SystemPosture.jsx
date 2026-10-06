import React from 'react';
import { ShieldCheck, ChevronRight, Activity, Cpu, Server, Lock, AlertTriangle, ArrowRight } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

export default function SystemPosture({ onSay }) {
  const subsystems = [
    {
      id: 'endpoint',
      icon: <Cpu size={14} />,
      label: 'Endpoint Protection Fleet',
      detail: '24 / 25 devices verified safe',
      status: 'safe',
      badge: 'Protected'
    },
    {
      id: 'firewall',
      icon: <Lock size={14} />,
      label: 'Edge Stateful Firewall',
      detail: 'BGP peering filter active',
      status: 'safe',
      badge: 'Nominal'
    },
    {
      id: 'dns',
      icon: <Activity size={14} />,
      label: 'DNS Sinkhole Sensor',
      detail: 'Zero rogue domains observed',
      status: 'safe',
      badge: 'Nominal'
    },
    {
      id: 'updates',
      icon: <Server size={14} />,
      label: 'OS & Firmware Patches',
      detail: 'Server-Main hotfix pending',
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

      {/* Instrument Score Box - Monochromatic Precision */}
      <div className="posture-gauge-box">
        <div className="posture-score-display">
          <strong>
            94<span>/100</span>
          </strong>
          <p className="text-ink-primary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-blue inline-block" />
            Optimal Posture Index
          </p>
          <span className="text-[11px] text-ink-muted mt-1 block font-mono">
            38 of 39 controls passed
          </span>
        </div>

        {/* Circular Gauge Instrument */}
        <div className="instrument-gauge">
          <svg className="gauge-ring-svg" width="68" height="68" viewBox="0 0 72 72">
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
          <span className="absolute inset-0 flex items-center justify-center text-signal-blue">
            <ShieldCheck size={20} />
          </span>
        </div>
      </div>

      {/* Subsystem Health Checklist - Natural Tight Spacing */}
      <div className="health-list">
        {subsystems.map(sub => (
          <button
            key={sub.id}
            className="health-item text-left group"
            onClick={() => {
              audioEngine.tick(0.04);
              onSay?.(`${sub.label}: ${sub.detail} (${sub.badge}).`);
            }}
          >
            <span className="min-w-0 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:bg-white/[0.1] transition-colors">
                {sub.icon}
              </span>
              <span className="truncate">
                <span className="font-medium text-slate-100 text-xs block leading-tight">{sub.label}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{sub.detail}</span>
              </span>
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
                sub.status === 'safe' 
                  ? 'bg-white/[0.06] text-slate-300 border-white/[0.1]' 
                  : 'bg-red-500/15 text-red-400 border-red-500/30'
              }`}>
                {sub.badge}
              </span>
              <ChevronRight size={13} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Operational Action Box - Fills Vertical Height Naturally */}
      <div className="posture-remediation-card mt-auto pt-3">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
              <AlertTriangle size={13} className="text-signal-coral flex-shrink-0" />
              Pending Remediation
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
              1 Host
            </span>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-300 font-mono">Server-Main (Ubuntu 22.04)</span>
            <span className="text-red-400 font-mono text-[11px] font-semibold">CVE-2024-3882</span>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.08] text-[11px]">
            <span className="text-slate-400 font-mono">CIS Controls: <strong className="text-slate-200 font-semibold">97.4%</strong></span>
            <button 
              type="button"
              className="text-sky-400 font-medium hover:underline inline-flex items-center gap-1 text-[11px]"
              onClick={() => {
                audioEngine.tick(0.04);
                onSay?.('Remediation brief: 1 patch pending for Server-Main (Ubuntu 22.04 LTS).');
              }}
            >
              Details <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
