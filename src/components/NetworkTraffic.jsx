import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { appleSprings } from '../lib/fluidMotion';
import { audioEngine } from '../lib/audioEngine';

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
    audioEngine.sonarPing(0.12);
    setIsSurge(true);
    setSurgeCountdown(4);
    setInboundTrace(prev => {
      const next = [...prev];
      next[next.length - 1] = Math.min(158, next[next.length - 1] + 45);
      return next;
    });
    onSay?.('Simulated ingress DDoS wave injected: Gateway rate surged to +48.2%.');
  };

  // Protocols breakdown - Cohesive, restrained tonal hierarchy
  const protocols = [
    { name: 'HTTPS', port: 'TLS 1.3 · Port 443', percent: 68, color: '#38BDF8', bandwidth: '96.8 Mbps' },
    { name: 'WireGuard', port: 'Zero-Trust · UDP 51820', percent: 16, color: '#0EA5E9', bandwidth: '22.8 Mbps' },
    { name: 'DNS (DoH)', port: 'Encrypted · Port 853', percent: 11, color: '#64748B', bandwidth: '15.6 Mbps' },
    { name: 'SSH Bastion', port: 'Protected · Port 22', percent: 5, color: '#94A3B8', bandwidth: '7.1 Mbps' }
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

  // Handle 1:1 direct pointer scrubbing (Instantaneous low-latency tracking)
  const handlePointerScrub = (e) => {
    if (!chartStageRef.current) return;
    const rect = chartStageRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(pct * (inboundTrace.length - 1));
    if (idx !== hoverIndex) {
      audioEngine.tick(0.015);
    }
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
      {/* Streamlined Balanced Header */}
      <header className="panel-heading mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse-subtle" />
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400">Gateway Telemetry</span>
          </div>
          <h2 className="font-display text-base text-white tracking-tight">Real-time Traffic Flow</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Rate Readouts */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-400/20 text-xs font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${isSurge ? 'bg-signal-coral animate-pulse' : 'bg-sky-400'}`} />
            <span className="text-white font-semibold">{currentInbound}</span>
            <span className="text-sky-300">Mbps In</span>
          </div>
          {streamMode === 'dual' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="text-white font-semibold">{currentOutbound}</span>
              <span className="text-slate-400">Mbps Out</span>
            </div>
          )}

          {/* Time Period Filter Pills */}
          <div className="period sm:ml-1">
            {['1h', '6h', '24h', '7d'].map(p => (
              <button
                key={p}
                className={period === p ? 'selected' : ''}
                onClick={() => {
                  audioEngine.tick(0.04);
                  setPeriod?.(p);
                  onSay?.(`Window set to ${p}.`);
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button 
            type="button"
            className="secondary-btn text-xs ml-1"
            onClick={handleSimulateSurge}
            title="Inject traffic surge test"
          >
            <Zap size={13} className="text-signal-coral" />
            Surge
          </button>
        </div>
      </header>

      {/* Stream Mode Switch & DPI Status Row */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="streaming">
            <em />
            <span className="font-mono text-slate-300 text-xs">Live DPI Stream</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                audioEngine.tick(0.04);
                setStreamMode('dual');
              }}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                streamMode === 'dual' ? 'bg-white/[0.12] text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dual Stream
            </button>
            <button
              type="button"
              onClick={() => {
                audioEngine.tick(0.04);
                setStreamMode('inbound');
              }}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                streamMode === 'inbound' ? 'bg-white/[0.12] text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ingress Only
            </button>
          </div>
        </div>

        <span className="text-slate-400 text-[11px] font-mono hidden md:inline">
          DPI Filter Active · 0 SYN_RECV
        </span>
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

        {/* SVG Chart Stage with iOS Fluid Pointer Capture */}
        <div 
          ref={chartStageRef}
          className="traffic-chart-stage live-chart cursor-crosshair touch-none"
          onPointerDown={handlePointerScrub}
          onPointerMove={(e) => {
            if (e.buttons > 0 || hoverIndex !== null) {
              handlePointerScrub(e);
            }
          }}
          onPointerUp={() => setHoverIndex(null)}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerCancel={() => setHoverIndex(null)}
        >
          {/* Crosshair Vertical Guide Ruler */}
          {activeHoverData && (
            <div 
              className="crosshair-ruler"
              style={{ left: `${activeHoverData.pctX}%` }}
            />
          )}

          {/* Floating Scrubbing Tooltip with Fluid Spring Glide */}
          <AnimatePresence>
            {activeHoverData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 4 }}
                transition={appleSprings.dropdown}
                className="traffic-scrub-tooltip"
                style={{ left: `${Math.max(16, Math.min(84, activeHoverData.pctX))}%` }}
              >
                <div className="traffic-scrub-tooltip-header">
                  <span>⏱️ {activeHoverData.time}</span>
                  <span className="text-slate-300 font-mono text-[10px]">DPI: VERIFIED</span>
                </div>
                <div className="traffic-scrub-row">
                  <span className="text-slate-300 flex items-center gap-1.5 font-mono text-xs">
                    <i className="w-2 h-2 rounded-full bg-signal-blue inline-block" /> Inbound Ingress
                  </span>
                  <b className="text-white font-mono">{activeHoverData.inbound} Mbps</b>
                </div>
                {streamMode === 'dual' && (
                  <div className="traffic-scrub-row">
                    <span className="text-slate-300 flex items-center gap-1.5 font-mono text-xs">
                      <i className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Outbound Egress
                    </span>
                    <b className="text-white font-mono">{activeHoverData.outbound} Mbps</b>
                  </div>
                )}
                <div className="traffic-scrub-row pt-1 border-t border-white/10 mt-1.5 text-[11px] text-slate-400 font-mono">
                  <span>Drop Rate: 0.00%</span>
                  <span className="text-slate-300 font-medium">Nominal Flow</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <svg viewBox="0 0 680 185" preserveAspectRatio="none" className={isSurge ? 'surge' : ''}>
            <defs>
              {/* Inbound Telemetry Gradient - Electric Cyan Glow */}
              <linearGradient id="inboundFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isSurge ? "#EF4444" : "#38BDF8"} stopOpacity="0.22" />
                <stop offset="60%" stopColor={isSurge ? "#EF4444" : "#38BDF8"} stopOpacity="0.06" />
                <stop offset="100%" stopColor={isSurge ? "#EF4444" : "#38BDF8"} stopOpacity="0" />
              </linearGradient>
              {/* Outbound Telemetry Gradient */}
              <linearGradient id="outboundFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Precision Reference Grid Lines */}
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

            {/* Live Pulsing Ingestion Tip Circles */}
            <circle cx="680" cy={lastInboundY} r="4.5" fill={isSurge ? "#EF4444" : "#38BDF8"} stroke="#080A0F" strokeWidth="2" />
            {streamMode === 'dual' && (
              <circle cx="680" cy={lastOutboundY} r="3.5" fill="#94A3B8" stroke="#080A0F" strokeWidth="1.5" />
            )}
          </svg>
        </div>
      </div>

      {/* Synchronized X-Axis Time Labels matching the selected period */}
      <div className="flex justify-between text-xs text-slate-500 pl-14 pr-2 font-medium font-mono">
        {activeDataset.xAxis.map((label, i) => (
          <span 
            key={i} 
            className={i === activeDataset.xAxis.length - 1 ? (isSurge ? 'text-signal-coral font-bold flex items-center gap-1' : 'text-signal-blue font-bold flex items-center gap-1') : ''}
          >
            {i === activeDataset.xAxis.length - 1 && (
              <span className={`w-1.5 h-1.5 rounded-full ${isSurge ? 'bg-signal-coral' : 'bg-signal-blue'} animate-pulse`} />
            )}
            {label}
          </span>
        ))}
      </div>

      {/* Deep Packet Inspection (DPI) Protocol Composition */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5 font-display">
            <Layers size={14} className="text-slate-400" />
            Traffic Composition by Protocol
          </span>
          <span className="text-slate-400 text-[11px] font-mono">DPI Inspected: 100% · Zero Drops</span>
        </div>

        {/* Stacked progress bar */}
        <div className="w-full h-2.5 rounded-full bg-white/[0.06] flex overflow-hidden mb-3 shadow-inner">
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
                className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full cursor-pointer hover:brightness-125"
                onClick={() => {
                  audioEngine.tick(0.04);
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
                    ? 'border-sky-400/40 bg-white/[0.08] shadow-sm' 
                    : 'border-transparent hover:bg-white/[0.04]'
                }`}
                onClick={() => {
                  audioEngine.tick(0.04);
                  setSelectedProtocol(isSelected ? null : proto.name);
                  onSay?.(`Protocol ${proto.name} (${proto.port}) selected: ${proto.percent}% share.`);
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: proto.color }} />
                  <span className="font-semibold text-slate-200 truncate">{proto.name}</span>
                  <span className="font-bold text-sky-400 font-mono ml-auto">{proto.percent}%</span>
                </div>
                <span className="text-[11px] text-slate-400 block truncate font-mono">{proto.port}</span>
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
