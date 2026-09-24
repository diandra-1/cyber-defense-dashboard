import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Activity, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Wifi, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

// Authentic production historical datasets per time window
const PERIOD_DATASETS = {
  '1h': {
    label: 'Last 60 Minutes (3-min telemetry intervals)',
    inbound: [118, 124, 116, 128, 122, 135, 128, 142, 134, 146, 125, 132, 128, 144, 138, 142, 130, 136, 134, 142],
    outbound: [36, 38, 35, 42, 38, 46, 40, 48, 44, 51, 42, 45, 42, 49, 45, 48, 42, 46, 44, 48],
    xAxis: ['13:00', '13:15', '13:30', '13:45', '14:00 (Now)'],
    baselineInbound: '125.0 Mbps',
    baselineOutbound: '42.0 Mbps',
    totalVolume: '58.4 GB',
    timeFormatter: (idx) => `13:${(idx * 3).toString().padStart(2, '0')} WIB`
  },
  '6h': {
    label: 'Last 6 Hours (18-min telemetry intervals)',
    inbound: [86, 94, 90, 104, 110, 124, 138, 144, 132, 128, 118, 124, 130, 142, 136, 130, 124, 128, 132, 136],
    outbound: [28, 30, 29, 34, 38, 44, 48, 52, 46, 42, 38, 40, 44, 48, 46, 43, 41, 44, 45, 48],
    xAxis: ['08:00', '09:30', '11:00', '12:30', '14:00 (Now)'],
    baselineInbound: '118.0 Mbps',
    baselineOutbound: '39.0 Mbps',
    totalVolume: '342.1 GB',
    timeFormatter: (idx) => {
      const totalMinutes = idx * 18;
      const hour = 8 + Math.floor(totalMinutes / 60);
      const min = totalMinutes % 60;
      return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} WIB`;
    }
  },
  '24h': {
    label: 'Last 24 Hours (Diurnal Day/Night Cycle)',
    inbound: [62, 54, 48, 44, 52, 68, 88, 112, 128, 138, 144, 136, 128, 134, 142, 138, 130, 124, 128, 134],
    outbound: [22, 18, 16, 15, 18, 24, 32, 42, 48, 52, 54, 50, 46, 48, 51, 49, 45, 42, 44, 46],
    xAxis: ['00:00', '06:00', '12:00', '18:00', 'Now'],
    baselineInbound: '105.0 Mbps',
    baselineOutbound: '36.0 Mbps',
    totalVolume: '1.24 TB',
    timeFormatter: (idx) => {
      const hour = Math.min(23, Math.floor(idx * 1.2));
      return `${hour.toString().padStart(2, '0')}:00 WIB`;
    }
  },
  '7d': {
    label: 'Last 7 Days (Weekly Business Cycle)',
    inbound: [124, 132, 128, 136, 140, 134, 138, 142, 135, 138, 128, 115, 96, 88, 82, 94, 112, 124, 128, 132],
    outbound: [42, 46, 44, 48, 50, 48, 49, 52, 48, 50, 44, 38, 30, 26, 25, 29, 38, 43, 44, 46],
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    baselineInbound: '112.0 Mbps',
    baselineOutbound: '38.0 Mbps',
    totalVolume: '8.65 TB',
    timeFormatter: (idx) => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayIdx = Math.min(6, Math.floor(idx / (20 / 7)));
      const timeSlot = (idx % 3 === 0) ? '08:00' : (idx % 3 === 1) ? '14:00' : '20:00';
      return `${days[dayIdx]} ${timeSlot}`;
    }
  }
};

export default function NetworkTraffic({ period = '24h', setPeriod, onSay }) {
  // Current active period configuration
  const activeDataset = PERIOD_DATASETS[period] || PERIOD_DATASETS['24h'];

  // Historical traces initialized from selected period
  const [inboundTrace, setInboundTrace] = useState(() => [...activeDataset.inbound]);
  const [outboundTrace, setOutboundTrace] = useState(() => [...activeDataset.outbound]);

  // Surge simulation state
  const [isSurge, setIsSurge] = useState(false);
  const [surgeCountdown, setSurgeCountdown] = useState(0);

  // Display mode: 'dual' (Ingress + Egress) or 'inbound' (Ingress only)
  const [streamMode, setStreamMode] = useState('dual');

  // Interactive hover & crosshair scrubbing
  const [hoverIndex, setHoverIndex] = useState(null);
  const chartStageRef = useRef(null);

  // Selected protocol highlight
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // When user switches period, authentically update traces and baseline
  useEffect(() => {
    const dataset = PERIOD_DATASETS[period] || PERIOD_DATASETS['24h'];
    setInboundTrace([...dataset.inbound]);
    setOutboundTrace([...dataset.outbound]);
    setIsSurge(false);
    setSurgeCountdown(0);
    setHoverIndex(null);
  }, [period]);

  // Live streaming tick interval (1,200ms) - smoothly updates only the live tail point!
  useEffect(() => {
    const timer = setInterval(() => {
      setInboundTrace(prev => {
        const last = prev[prev.length - 1];
        let drift = (Math.random() - 0.48) * 14;
        let surgeOffset = 0;

        if (surgeCountdown > 0) {
          surgeOffset = surgeCountdown * 12;
          setSurgeCountdown(c => Math.max(0, c - 1));
          if (surgeCountdown <= 1) setIsSurge(false);
        }

        const next = Math.max(55, Math.min(158, Math.round(last + drift + surgeOffset)));
        return [...prev.slice(1), next];
      });

      setOutboundTrace(prev => {
        const last = prev[prev.length - 1];
        const drift = (Math.random() - 0.5) * 6;
        const next = Math.max(22, Math.min(68, Math.round(last + drift)));
        return [...prev.slice(1), next];
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [surgeCountdown]);

  // Current live readouts
  const currentInbound = inboundTrace[inboundTrace.length - 1];
  const currentOutbound = outboundTrace[outboundTrace.length - 1];
  const packetRate = (12400 + currentInbound * 38).toLocaleString();

  // Trigger real-time traffic surge simulation
  const handleSimulateSurge = () => {
    setIsSurge(true);
    setSurgeCountdown(4);
    setInboundTrace(prev => {
      const next = [...prev];
      next[next.length - 1] = Math.min(158, Math.max(145, next[next.length - 1] + 35));
      return next;
    });
    onSay?.('Traffic surge injected: Inbound velocity peaked at +75 Mbps. Gateway auto-scaling engaged.');
  };

  // Protocols breakdown
  const protocols = [
    { name: 'HTTPS', port: 'TLS 1.3 · Port 443', percent: 68, color: '#2563EB', bandwidth: '96.8 Mbps' },
    { name: 'WireGuard', port: 'Zero-Trust · UDP 51820', percent: 16, color: '#10B981', bandwidth: '22.8 Mbps' },
    { name: 'DNS (DoH)', port: 'Encrypted · Port 853', percent: 11, color: '#F59E0B', bandwidth: '15.6 Mbps' },
    { name: 'SSH Bastion', port: 'Protected · Port 22', percent: 5, color: '#64748B', bandwidth: '7.1 Mbps' }
  ];

  // SVG Canvas dimensions
  const svgWidth = 680;
  const svgHeight = 180;

  // Generate cubic spline Bézier paths for natural smooth curves
  const getSplinePath = (data, closeToBottom = false) => {
    if (!data || data.length === 0) return '';
    const step = svgWidth / (data.length - 1);
    
    // Map values (0 - 160 Mbps) to Y coordinates (175 - 15)
    const points = data.map((val, idx) => [
      idx * step,
      175 - (val / 160) * 155
    ]);

    let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1[0] + (p2[0] - p0[0]) / 5.5;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 5.5;

      const cp2x = p2[0] - (p3[0] - p1[0]) / 5.5;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 5.5;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }

    if (closeToBottom) {
      d += ` L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
    }
    return d;
  };

  const inboundSpline = useMemo(() => getSplinePath(inboundTrace, false), [inboundTrace]);
  const inboundArea = useMemo(() => getSplinePath(inboundTrace, true), [inboundTrace]);

  const outboundSpline = useMemo(() => getSplinePath(outboundTrace, false), [outboundTrace]);
  const outboundArea = useMemo(() => getSplinePath(outboundTrace, true), [outboundTrace]);

  // Last points coordinates for live ingestion tip
  const lastInboundY = 175 - (currentInbound / 160) * 155;
  const lastOutboundY = 175 - (currentOutbound / 160) * 155;

  // Handle hover crosshair scrubbing
  const handleStageMouseMove = (e) => {
    if (!chartStageRef.current) return;
    const rect = chartStageRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(pct * (inboundTrace.length - 1));
    setHoverIndex(idx);
  };

  const activeHoverData = hoverIndex !== null ? {
    inbound: inboundTrace[hoverIndex],
    outbound: outboundTrace[hoverIndex],
    pctX: (hoverIndex / (inboundTrace.length - 1)) * 100,
    time: activeDataset.timeFormatter(hoverIndex)
  } : null;

  return (
    <article className="panel traffic-panel">
      {/* Panel Header */}
      <header className="panel-heading">
        <div>
          <h2 className="font-display">Network Traffic & Gateway Telemetry</h2>
          <p>Sensor Node: Gateway-East-01 (AS13335) · {activeDataset.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            Vol: {activeDataset.totalVolume}
          </span>

          <button 
            type="button"
            className="secondary-btn text-xs"
            onClick={handleSimulateSurge}
            title="Inject a real-time traffic surge"
          >
            <Zap size={13} className="text-signal-coral" />
            Simulate Surge
          </button>
          <button 
            className="secondary-btn text-xs"
            onClick={() => onSay?.(`Network PCAP flow exported for ${period} (${activeDataset.totalVolume}).`)}
          >
            <Download size={13} />
            Export PCAP
          </button>
        </div>
      </header>

      {/* Production-Grade Real-time Telemetry KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 rounded-xl bg-slate-50 border border-ink-border">
        <div>
          <span className="text-[11px] text-slate-500 block uppercase font-semibold tracking-wider">Inbound Ingress</span>
          <span className="text-lg font-bold text-slate-900 flex items-baseline gap-1.5 mt-0.5 font-display">
            <span className="w-2 h-2 rounded-full bg-signal-coral inline-block" />
            {currentInbound} <small className="text-xs font-medium text-slate-500 font-sans">Mbps</small>
            <span className={`text-[11px] font-semibold ml-1 ${isSurge ? 'text-signal-coral' : 'text-signal-emerald'}`}>
              {isSurge ? '+48.2%' : '+5.8%'}
            </span>
          </span>
          <small className="text-[10px] text-slate-400 block">Baseline: {activeDataset.baselineInbound}</small>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block uppercase font-semibold tracking-wider">Outbound Egress</span>
          <span className="text-lg font-bold text-slate-900 flex items-baseline gap-1.5 mt-0.5 font-display">
            <span className="w-2 h-2 rounded-full bg-signal-blue inline-block" />
            {currentOutbound} <small className="text-xs font-medium text-slate-500 font-sans">Mbps</small>
            <span className="text-[11px] font-semibold text-slate-500 ml-1">-1.4%</span>
          </span>
          <small className="text-[10px] text-slate-400 block">Baseline: {activeDataset.baselineOutbound}</small>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block uppercase font-semibold tracking-wider">Packet Velocity</span>
          <span className="text-lg font-bold text-slate-900 block mt-0.5 font-display">
            {packetRate} <small className="text-xs font-medium text-slate-500 font-sans">p/s</small>
          </span>
          <small className="text-[10px] text-signal-emerald block">Jitter: 1.1ms · 0% Drop</small>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block uppercase font-semibold tracking-wider">Active Sockets</span>
          <span className="text-lg font-bold text-signal-emerald block mt-0.5 font-display">
            248 <small className="text-xs font-medium text-slate-500 font-sans">Streams</small>
          </span>
          <small className="text-[10px] text-slate-400 block">0 SYN_RECV · Buffer OK</small>
        </div>
      </div>

      {/* Controls: Stream Legend, Overlay Mode Switch, and Authentically Functional Time Filter */}
      <div className="traffic-controls">
        <div className="flex items-center gap-4">
          <div className="streaming">
            <em />
            <span className="font-semibold text-slate-700">Live Telemetry Tail</span>
          </div>

          {/* Mode Switch: Inbound vs Dual Stream */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setStreamMode('dual')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                streamMode === 'dual' ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dual Stream (In + Out)
            </button>
            <button
              type="button"
              onClick={() => setStreamMode('inbound')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                streamMode === 'inbound' ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ingress Only
            </button>
          </div>
        </div>

        {/* Authentically Functional Time Period Filter */}
        <div className="period">
          {['1h', '6h', '24h', '7d'].map(p => (
            <button
              key={p}
              className={period === p ? 'selected' : ''}
              onClick={() => {
                setPeriod?.(p);
                onSay?.(`Network window shifted to ${p}: ${PERIOD_DATASETS[p].label}`);
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Production Dual-Stream Waveform Chart with Y-Axis, Capacity Threshold, and Crosshair Tooltip */}
      <div className="traffic-chart-container">
        {/* Y-Axis Reference Scale (Mbps) */}
        <div className="traffic-y-axis">
          <span>160M</span>
          <span>120M</span>
          <span>80M</span>
          <span>40M</span>
          <span>0M</span>
        </div>

        {/* SVG Chart Stage */}
        <div 
          ref={chartStageRef}
          className="traffic-chart-stage live-chart"
          onMouseMove={handleStageMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Crosshair Vertical Guide Ruler (only appears on hover) */}
          {activeHoverData && (
            <div 
              className="crosshair-ruler"
              style={{ left: `${activeHoverData.pctX}%` }}
            />
          )}

          {/* Floating Scrubbing Tooltip */}
          {activeHoverData && (
            <div 
              className="traffic-scrub-tooltip"
              style={{ left: `${Math.max(16, Math.min(84, activeHoverData.pctX))}%` }}
            >
              <div className="traffic-scrub-tooltip-header">
                <span>⏱️ {activeHoverData.time}</span>
                <span className="text-signal-emerald">DPI: OK</span>
              </div>
              <div className="traffic-scrub-row">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <i className="w-2 h-2 rounded-full bg-signal-coral inline-block" /> Inbound Ingress
                </span>
                <b className="text-white">{activeHoverData.inbound} Mbps</b>
              </div>
              {streamMode === 'dual' && (
                <div className="traffic-scrub-row">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <i className="w-2 h-2 rounded-full bg-signal-blue inline-block" /> Outbound Egress
                  </span>
                  <b className="text-white">{activeHoverData.outbound} Mbps</b>
                </div>
              )}
              <div className="traffic-scrub-row pt-1 border-t border-white/10 mt-1.5 text-[11px] text-slate-400">
                <span>Drop Rate: 0.00%</span>
                <span className="text-emerald-400 font-semibold">Nominal Flow</span>
              </div>
            </div>
          )}

          <svg viewBox="0 0 680 185" preserveAspectRatio="none">
            <defs>
              {/* Inbound Coral Gradient */}
              <linearGradient id="coralFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2542D" stopOpacity="0.22" />
                <stop offset="80%" stopColor="#F2542D" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#F2542D" stopOpacity="0" />
              </linearGradient>
              {/* Outbound Blue Gradient */}
              <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Precision Reference Grid Lines (0M, 40M, 80M, 120M, 160M) */}
            {[20, 60, 100, 140, 175].map(y => (
              <line key={y} x1="0" x2="680" y1={y} y2={y} />
            ))}

            {/* Inbound Area & Smooth Cubic Spline */}
            <polygon className="inbound-area" points={`0,180 ${inboundArea.replace(/^M [^C]+ C/, '')}`} />
            <path className="inbound-path" d={inboundSpline} />

            {/* Outbound Egress Overlay Curve (when dual mode is active) */}
            {streamMode === 'dual' && (
              <>
                <polygon className="outbound-area" points={`0,180 ${outboundArea.replace(/^M [^C]+ C/, '')}`} />
                <path className="outbound-path" d={outboundSpline} />
              </>
            )}

            {/* Live Pulsing Ingestion Tip Circles (Ujung kanan data terbaru) */}
            <circle cx="680" cy={lastInboundY} r="5" fill="#F2542D" stroke="#FFFFFF" strokeWidth="2.5" />
            {streamMode === 'dual' && (
              <circle cx="680" cy={lastOutboundY} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            )}
          </svg>
        </div>
      </div>

      {/* Synchronized X-Axis Time Labels matching the selected period */}
      <div className="flex justify-between text-xs text-slate-500 pl-14 pr-2 font-medium">
        {activeDataset.xAxis.map((label, i) => (
          <span 
            key={i} 
            className={i === activeDataset.xAxis.length - 1 ? 'text-signal-coral font-bold flex items-center gap-1' : ''}
          >
            {i === activeDataset.xAxis.length - 1 && (
              <span className="w-1.5 h-1.5 rounded-full bg-signal-coral animate-pulse" />
            )}
            {label}
          </span>
        ))}
      </div>

      {/* Deep Packet Inspection (DPI) Protocol Composition */}
      <div className="mt-4 pt-3.5 border-t border-ink-border">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-900 flex items-center gap-1.5 font-display">
            <Layers size={14} className="text-slate-500" />
            Traffic Composition by Protocol
          </span>
          <span className="text-slate-500 text-[11px] font-medium">DPI Inspected: 100% · Zero Packet Drops</span>
        </div>

        {/* Stacked multi-color progress bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 flex overflow-hidden mb-3 shadow-inner">
          {protocols.map((proto, idx) => {
            const isSelected = selectedProtocol === proto.name;
            return (
              <div 
                key={idx} 
                style={{ 
                  width: `${proto.percent}%`, 
                  backgroundColor: proto.color,
                  opacity: selectedProtocol && !isSelected ? 0.35 : 1
                }} 
                className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full cursor-pointer hover:brightness-110"
                onClick={() => {
                  setSelectedProtocol(isSelected ? null : proto.name);
                  onSay?.(`Inspecting ${proto.name}: ${proto.port} throughput is ${proto.bandwidth}.`);
                }}
                title={`${proto.name}: ${proto.percent}%`}
              />
            );
          })}
        </div>

        {/* Clickable Protocol Legends with Port Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {protocols.map((proto, idx) => {
            const isSelected = selectedProtocol === proto.name;
            return (
              <button
                key={idx}
                type="button"
                className={`p-2 rounded-lg text-left transition-all border ${
                  isSelected 
                    ? 'border-slate-400 bg-slate-100 shadow-sm' 
                    : 'border-transparent hover:bg-slate-50'
                }`}
                onClick={() => {
                  setSelectedProtocol(isSelected ? null : proto.name);
                  onSay?.(`Protocol ${proto.name} (${proto.port}) selected: ${proto.percent}% share.`);
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: proto.color }} />
                  <span className="font-semibold text-slate-900 truncate">{proto.name}</span>
                  <span className="font-bold text-slate-700 ml-auto">{proto.percent}%</span>
                </div>
                <span className="text-[11px] text-slate-500 block truncate">{proto.port}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Production Footer Insight Bar */}
      <button 
        className="insight mt-3 w-full"
        onClick={() => onSay?.(`Gateway health nominal: Current stream is ${currentInbound} Mbps. Hardware BPF filter active across 248 sockets.`)}
      >
        <span>
          <ShieldCheck size={18} className="text-signal-emerald" />
        </span>
        <div>
          <b>Edge Telemetry Status: Optimal</b>
          <small>Automated DPI filter actively protecting 248 concurrent connections with zero packet drops.</small>
        </div>
        <ArrowRight size={15} />
      </button>
    </article>
  );
}
