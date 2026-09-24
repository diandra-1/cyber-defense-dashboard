import React, { useState } from 'react';
import { 
  Laptop, 
  Server, 
  Smartphone, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ChevronRight,
  Lock,
  RefreshCw
} from 'lucide-react';

export default function AssetsView({ onSay }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const assets = [
    { name: 'Server-Main', ip: '192.168.1.5', os: 'Ubuntu 22.04 LTS', type: 'Server', status: 'needs-action', agent: 'v4.12.1', lastSeen: 'Just now' },
    { name: 'Desktop-PC-Eng', ip: '192.168.1.10', os: 'Windows 11 Pro', type: 'Workstation', status: 'safe', agent: 'v4.12.2', lastSeen: '1 min ago' },
    { name: 'Laptop-John', ip: '192.168.1.15', os: 'macOS Sonoma', type: 'Laptop', status: 'safe', agent: 'v4.12.2', lastSeen: '3 mins ago' },
    { name: 'Finance-Mac', ip: '192.168.1.42', os: 'macOS Sonoma', type: 'Laptop', status: 'safe', agent: 'v4.12.2', lastSeen: '2 mins ago' },
    { name: 'Bastion-Gateway-01', ip: '10.0.0.1', os: 'Hardened Linux', type: 'Gateway', status: 'safe', agent: 'v4.12.0', lastSeen: 'Active' },
    { name: 'DB-Replica-Cluster', ip: '10.0.0.25', os: 'Debian 12', type: 'Database', status: 'safe', agent: 'v4.12.2', lastSeen: 'Active' },
    { name: 'IoT-Perimeter-Cam', ip: '192.168.1.88', os: 'Embedded RTOS', type: 'IoT', status: 'safe', agent: 'Perimeter ACL', lastSeen: '10 mins ago' },
    { name: 'CI-Runner-Node', ip: '10.0.0.99', os: 'Ubuntu 24.04 LTS', type: 'Worker', status: 'safe', agent: 'v4.12.2', lastSeen: 'Just now' },
  ];

  const filtered = assets.filter(a => {
    const matchesFilter = filter === 'All' 
      ? true 
      : filter === 'Protected' ? a.status === 'safe' : a.status === 'needs-action';
    const matchesQuery = `${a.name} ${a.ip} ${a.os} ${a.type}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Asset Posture Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="panel flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-muted uppercase font-mono tracking-wider">Total Managed Nodes</span>
            <div className="font-mono text-3xl font-bold text-ink-primary mt-1">25</div>
            <span className="text-[11px] text-signal-emerald flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} /> 100% telemetry visibility
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-ink-secondary">
            <Server size={22} />
          </div>
        </div>

        <div className="panel flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-muted uppercase font-mono tracking-wider">Protected Endpoints</span>
            <div className="font-mono text-3xl font-bold text-signal-emerald mt-1">24</div>
            <span className="text-[11px] text-ink-muted mt-1 block">96.0% compliance target</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-signal-emerald-light flex items-center justify-center text-signal-emerald">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="panel flex items-center justify-between border-signal-coral/20">
          <div>
            <span className="text-xs text-signal-coral uppercase font-mono tracking-wider">Pending Remediation</span>
            <div className="font-mono text-3xl font-bold text-signal-coral mt-1">1</div>
            <span className="text-[11px] text-ink-muted mt-1 block">Server-Main patch & egress review</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-signal-coral-light flex items-center justify-center text-signal-coral">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Asset Inventory Table */}
      <div className="panel">
        <header className="panel-heading">
          <div>
            <h2>Managed Device Inventory</h2>
            <p>Protection status and active agent telemetry across enterprise endpoints</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="search">
              <Search size={14} className="text-ink-muted" />
              <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search device name, IP, OS..."
                className="w-48 text-xs"
              />
            </div>
            <div className="period">
              {['All', 'Protected', 'Needs Action'].map(f => (
                <button
                  key={f}
                  className={filter === f ? 'selected' : ''}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-border text-ink-muted font-mono text-[11px]">
                <th className="py-3 px-3">ENDPOINT NAME</th>
                <th className="py-3 px-3">IPV4 ADDRESS</th>
                <th className="py-3 px-3">PLATFORM / OS</th>
                <th className="py-3 px-3">EDR AGENT</th>
                <th className="py-3 px-3">LAST TELEMETRY</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-border">
              {filtered.map(device => {
                const isSafe = device.status === 'safe';
                return (
                  <tr 
                    key={device.name}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSay?.(`Inspecting asset ${device.name} (${device.ip}). Agent health: Nominal.`)}
                  >
                    <td className="py-3 px-3 font-semibold text-ink-primary flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSafe ? 'bg-signal-emerald-light text-signal-emerald' : 'bg-signal-coral-light text-signal-coral'
                      }`}>
                        {device.type === 'Server' ? <Server size={14} /> : <Laptop size={14} />}
                      </div>
                      <span>{device.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-ink-secondary">{device.ip}</td>
                    <td className="py-3 px-3 text-ink-secondary">{device.os}</td>
                    <td className="py-3 px-3 font-mono text-ink-muted">{device.agent}</td>
                    <td className="py-3 px-3 font-mono text-ink-muted">{device.lastSeen}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        isSafe ? 'bg-signal-emerald-light text-signal-emerald' : 'bg-signal-coral-light text-signal-coral'
                      }`}>
                        <i className={`w-1.5 h-1.5 rounded-full ${isSafe ? 'bg-signal-emerald' : 'bg-signal-coral'}`} />
                        {isSafe ? 'PROTECTED' : 'ATTENTION'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        className="text-xs text-signal-blue hover:underline font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSay?.(`Dispatched remote diagnostic scan to ${device.name}.`);
                        }}
                      >
                        Scan Agent
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
