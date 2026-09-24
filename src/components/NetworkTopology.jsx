import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Laptop, 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  Server, 
  Wifi, 
  RefreshCw,
  Lock,
  Radio
} from 'lucide-react';
import { loadTopology, saveTopology } from '../services/securityStore';

export default function NetworkTopology({ onSay, isolatedState, setIsolatedState }) {
  const saved = loadTopology();
  const [focus, setFocus] = useState('Server-Main');
  const [internalIsolated, setInternalIsolated] = useState(saved.isolated);
  const [refreshing, setRefreshing] = useState(false);

  // Synchronize isolated state if parent provides it or use local
  const isolated = isolatedState !== undefined ? isolatedState : internalIsolated;
  const setIsolated = (val) => {
    if (setIsolatedState) {
      setIsolatedState(val);
    }
    setInternalIsolated(val);
  };

  const nodes = [
    {
      id: 'net',
      name: 'Internet',
      ip: '0.0.0.0/0',
      x: '8%',
      y: '50%',
      tone: 'external',
      icon: Globe,
      statusText: 'Untrusted WAN',
      desc: 'Public IP space with active ingress telemetry inspection.'
    },
    {
      id: 'gw',
      name: 'Edge Gateway',
      ip: '10.0.0.1',
      x: '30%',
      y: '50%',
      tone: 'gateway',
      icon: ShieldCheck,
      statusText: 'Protected Gateway',
      desc: 'Primary perimeter gateway. Hardware stateful inspection active.'
    },
    {
      id: 'pc1',
      name: 'Desktop-PC',
      ip: '192.168.1.10',
      x: '58%',
      y: '22%',
      tone: 'safe',
      icon: Laptop,
      statusText: 'Protected Endpoint',
      desc: 'Engineering workstation. EDR agent reporting zero anomalies.'
    },
    {
      id: 'lap1',
      name: 'Laptop-John',
      ip: '192.168.1.15',
      x: '59%',
      y: '76%',
      tone: 'safe',
      icon: Laptop,
      statusText: 'Protected Endpoint',
      desc: 'Mobile endpoint via 802.1X enterprise Wi-Fi. Traffic nominal.'
    },
    {
      id: 'srv1',
      name: 'Server-Main',
      ip: '192.168.1.5',
      x: '86%',
      y: '33%',
      tone: isolated ? 'isolated' : 'risk',
      icon: Server,
      statusText: isolated ? 'Quarantined / Isolated' : 'Suspicious Egress Flow',
      desc: isolated 
        ? 'Network egress blocked via ACL. Host unable to reach WAN.' 
        : 'Outbound command & control burst detected to 185.220.101.42.'
    },
    {
      id: 'mac1',
      name: 'Finance-Mac',
      ip: '192.168.1.42',
      x: '87%',
      y: '72%',
      tone: 'safe',
      icon: Laptop,
      statusText: 'Protected Endpoint',
      desc: 'Encrypted segment. Access granted via zero-trust policy.'
    }
  ];

  const activeNode = nodes.find(n => n.name === focus) || nodes[4];
  const isServer = activeNode.name === 'Server-Main';
  const needsAction = isServer && !isolated;

  const toggleContainment = () => {
    const next = !isolated;
    setIsolated(next);
    saveTopology({ isolated: next });
    onSay?.(next 
      ? 'Server-Main isolated. Outbound gateway route severed.' 
      : 'Server-Main restored. Normal network policy re-applied.'
    );
  };

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      onSay?.('Topology refreshed. 6 nodes and 5 active routes verified.');
    }, 600);
  };

  return (
    <article className="panel topology-card">
      <header className="panel-heading">
        <div>
          <h2>Network Topology & Device Connectivity</h2>
          <p>Interactive connection graph showing edge routing and live endpoint states</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="topology-live">
            <i /> Live Flow
          </span>
          <button 
            onClick={handleRefresh}
            className="p-1.5 rounded-lg border border-ink-border hover:bg-slate-50 text-ink-muted hover:text-ink-primary transition-all"
            title="Refresh Topology"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-signal-blue' : ''} />
          </button>
        </div>
      </header>

      {/* Topology Canvas */}
      <div className="topology-canvas">
        <svg viewBox="0 0 700 250" preserveAspectRatio="none">
          {/* Edge Connection Lines */}
          <path d="M 55 125 C 130 125, 160 125, 210 125" />
          <path d="M 235 118 C 300 85, 335 55, 395 55" />
          <path d="M 235 132 C 300 165, 340 190, 400 190" />
          <path d="M 425 55 C 500 60, 535 80, 590 82" />
          <path d="M 425 190 C 500 185, 540 180, 595 180" />

          {/* Active Risk Route to Server-Main */}
          <path 
            className={`risk-path ${isolated ? 'isolated' : ''}`}
            d="M 425 55 C 505 85, 535 82, 590 82" 
          />
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const NodeIcon = node.icon;
          const isFocused = focus === node.name;
          return (
            <button
              key={node.name}
              className={`topology-node ${node.tone} ${isFocused ? 'focused' : ''}`}
              style={{ left: node.x, top: node.y }}
              onClick={() => setFocus(node.name)}
            >
              <span>
                <NodeIcon size={14} />
              </span>
              <div>
                <b>{node.name}</b>
                <small>{node.ip}</small>
              </div>
            </button>
          );
        })}
      </div>

      {/* Node Inspector & Quarantine Action */}
      <section className={`topology-inspector ${needsAction ? 'attention' : ''}`}>
        <div className="inspector-icon">
          {needsAction ? (
            <ShieldAlert size={17} />
          ) : isolated && isServer ? (
            <Lock size={17} />
          ) : (
            <CheckCircle2 size={17} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <b>{activeNode.name}</b>
            <span className="font-mono text-[11px] text-ink-muted">({activeNode.ip})</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              needsAction 
                ? 'bg-signal-coral-light text-signal-coral'
                : isolated && isServer
                  ? 'bg-slate-200 text-ink-secondary'
                  : 'bg-signal-emerald-light text-signal-emerald'
            }`}>
              {activeNode.statusText}
            </span>
          </div>
          <small className="text-xs text-ink-secondary mt-0.5 block">
            {activeNode.desc}
          </small>
        </div>

        {/* Isolate / Restore Action Button */}
        {isServer && (
          <button 
            className={isolated ? 'restore-device' : 'isolate-device'}
            onClick={toggleContainment}
          >
            {isolated ? 'Restore Host' : 'Isolate Host'}
          </button>
        )}
      </section>

      {/* Footer Summary */}
      <div className="topology-summary">
        <span>
          <i className="safe" /> 
          {isolated ? '4 nominal endpoints' : '5 nominal endpoints'}
        </span>
        <span>
          <i className={isolated ? 'safe' : 'risk'} /> 
          {isolated ? '1 quarantined endpoint' : '1 attention required'}
        </span>
        <span className="ml-auto font-mono text-[11px] text-ink-muted">
          Perimeter MTU: 1500 · Zero Trust Mesh
        </span>
      </div>
    </article>
  );
}
