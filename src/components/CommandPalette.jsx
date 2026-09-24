import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  ShieldAlert, 
  ShieldCheck, 
  Network, 
  Activity, 
  Server, 
  Download, 
  FileSearch, 
  Laptop, 
  Sliders, 
  ArrowRight, 
  CornerDownLeft, 
  X,
  Radio,
  Zap
} from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onSimulate, 
  onIsolateServer, 
  isServerIsolated,
  onSay,
  alerts = [] 
}) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const actions = [
    {
      id: 'sim-threat',
      category: 'Simulate & Defense Actions',
      title: 'Simulate high-priority threat signal',
      subtitle: 'Inject a burst anomaly telemetry into the active triage queue',
      icon: <Zap size={16} className="text-signal-coral" />,
      run: () => {
        onSimulate();
        onClose();
      }
    },
    {
      id: 'isolate-server',
      category: 'Simulate & Defense Actions',
      title: isServerIsolated ? 'Restore Server-Main to network' : 'Isolate Server-Main endpoint',
      subtitle: isServerIsolated ? 'Reconnect Server-Main to Edge Gateway routes' : 'Immediately sever outbound routes for Server-Main',
      icon: <Server size={16} className={isServerIsolated ? "text-signal-emerald" : "text-signal-coral"} />,
      run: () => {
        onIsolateServer();
        onClose();
      }
    },
    {
      id: 'scan-network',
      category: 'Simulate & Defense Actions',
      title: 'Trigger Edge Gateway port audit',
      subtitle: 'Audit ports 22, 80, 443, 3389 across perimeter sensors',
      icon: <Radio size={16} className="text-signal-blue" />,
      run: () => {
        onClose();
        onSay('Perimeter sensor scan completed. 248 connections audited, 0 rogue ports.');
      }
    },
    {
      id: 'export-pcap',
      category: 'Simulate & Defense Actions',
      title: 'Export 24-hour Telemetry Log',
      subtitle: 'Download CSV audit digest of filtered network flow records',
      icon: <Download size={16} className="text-ink-secondary" />,
      run: () => {
        onClose();
        onSay('Audit log ready: telemetry-24h-export.csv downloaded.');
      }
    },
    {
      id: 'nav-overview',
      category: 'Navigation',
      title: 'Go to Overview Dashboard',
      subtitle: 'Unified telemetry stream and health posture',
      icon: <Activity size={16} className="text-signal-blue" />,
      run: () => {
        onNavigate('Overview');
        onClose();
      }
    },
    {
      id: 'nav-threats',
      category: 'Navigation',
      title: 'Go to Incident Response Board',
      subtitle: 'Kanban triage lanes for active threat findings',
      icon: <ShieldAlert size={16} className="text-signal-coral" />,
      run: () => {
        onNavigate('Threats');
        onClose();
      }
    },
    {
      id: 'nav-network',
      category: 'Navigation',
      title: 'Go to Network Traffic Monitor',
      subtitle: 'Live bandwidth throughput and gateway telemetry',
      icon: <Network size={16} className="text-signal-blue" />,
      run: () => {
        onNavigate('Network');
        onClose();
      }
    },
    {
      id: 'nav-bruteforce',
      category: 'Navigation',
      title: 'Go to Brute Force & Origin Intelligence',
      subtitle: 'Burst rate tracking and targeted port analysis',
      icon: <Terminal size={16} className="text-signal-amber" />,
      run: () => {
        onNavigate('Brute Force');
        onClose();
      }
    },
    {
      id: 'nav-malware',
      category: 'Navigation',
      title: 'Go to Malware & Metadata Sandbox',
      subtitle: 'Client-side heuristic file inspection and quarantine',
      icon: <FileSearch size={16} className="text-signal-coral" />,
      run: () => {
        onNavigate('Malware detection');
        onClose();
      }
    },
    {
      id: 'nav-assets',
      category: 'Navigation',
      title: 'Go to Managed Asset Inventory',
      subtitle: 'Protection coverage across 25 corporate devices',
      icon: <Laptop size={16} className="text-ink-secondary" />,
      run: () => {
        onNavigate('Assets');
        onClose();
      }
    }
  ];

  // Add any active alerts to search matching
  const alertActions = alerts.map(a => ({
    id: `alert-${a.id}`,
    category: 'Active Alert Signals',
    title: `${a.title} · ${a.source}`,
    subtitle: `${a.severity} Priority · ${a.country} — ${a.detail}`,
    icon: <ShieldAlert size={16} className="text-signal-coral" />,
    run: () => {
      onNavigate('Threats');
      onClose();
      onSay(`Inspecting alert: ${a.title} from ${a.source}`);
    }
  }));

  const allItems = [...actions, ...alertActions];

  const filtered = allItems.filter(item => 
    `${item.title} ${item.subtitle} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].run();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div 
        className="command-modal"
        onMouseDown={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-border bg-white">
          <Search size={18} className="text-ink-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, navigate, or search active threats..."
            className="w-full text-sm outline-none text-ink-primary bg-transparent placeholder-ink-muted"
          />
          <button 
            onClick={onClose}
            className="text-ink-muted hover:text-ink-primary p-1 rounded-md"
          >
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded">ESC</kbd>
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-ink-muted text-xs">
              No matching commands or threat records found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.run}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'bg-slate-100 text-ink-primary' : 'text-ink-secondary hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink-primary truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/60 text-ink-muted uppercase tracking-wider font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CornerDownLeft size={13} className="text-ink-muted ml-2 flex-shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-ink-border text-[11px] text-ink-muted">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px]">↑</kbd> <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px]">↵</kbd> to select</span>
          </div>
          <span className="font-mono text-[10px] text-signal-blue">21st.dev Command Palette</span>
        </div>
      </div>
    </div>
  );
}
