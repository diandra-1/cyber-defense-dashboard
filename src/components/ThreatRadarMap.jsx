import React, { useState, useEffect, useRef, useMemo } from 'react';
import createGlobe from 'cobe';
import { 
  ArrowRight, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Server, 
  Activity, 
  Wifi, 
  Lock, 
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';

export default function ThreatRadarMap({ onSay, onNavigate }) {
  const canvasRef = useRef(null);
  const pointerStart = useRef({ x: 0, y: 0 });

  // Smooth rotation angles
  const phiRef = useRef(0);
  const thetaRef = useRef(0.15);
  const targetPhiRef = useRef(0);
  const targetThetaRef = useRef(0.15);
  const isInteractingRef = useRef(false);

  // Global Edge Network PoPs (Vercel/Cloudflare style CDN architecture)
  const edgePoPs = [
    {
      id: 'sin1',
      region: 'sin1',
      city: 'Singapore',
      country: 'Singapore',
      flag: '🇸🇬',
      location: [1.35, 103.82],
      role: 'Core Edge Gateway (HQ)',
      traffic: '1.2 TB/s',
      reqRate: '420k req/s',
      status: 'Clean · 99.98% Scrubbed',
      isHQ: true
    },
    {
      id: 'iad1',
      region: 'iad1',
      city: 'Washington DC',
      country: 'United States',
      flag: '🇺🇸',
      location: [38.95, -77.45],
      role: 'US East Edge Ingress',
      traffic: '2.4 TB/s',
      reqRate: '890k req/s',
      status: 'High Load · Mitigated'
    },
    {
      id: 'sfo1',
      region: 'sfo1',
      city: 'San Francisco',
      country: 'United States',
      flag: '🇺🇸',
      location: [37.62, -122.38],
      role: 'US West Edge Transit',
      traffic: '1.8 TB/s',
      reqRate: '610k req/s',
      status: 'Active Route'
    },
    {
      id: 'cdg1',
      region: 'cdg1',
      city: 'Paris',
      country: 'France',
      flag: '🇫🇷',
      location: [49.01, 2.55],
      role: 'EU West Transit PoP',
      traffic: '1.6 TB/s',
      reqRate: '540k req/s',
      status: 'Active Route'
    },
    {
      id: 'fra1',
      region: 'fra1',
      city: 'Frankfurt',
      country: 'Germany',
      flag: '🇩🇪',
      location: [50.11, 8.68],
      role: 'Central Europe Core',
      traffic: '1.4 TB/s',
      reqRate: '480k req/s',
      status: 'DDoS Scrubbed'
    },
    {
      id: 'hnd1',
      region: 'hnd1',
      city: 'Tokyo',
      country: 'Japan',
      flag: '🇯🇵',
      location: [35.55, 139.78],
      role: 'East Asia Backbone',
      traffic: '1.8 TB/s',
      reqRate: '620k req/s',
      status: 'Active Route'
    },
    {
      id: 'syd1',
      region: 'syd1',
      city: 'Sydney',
      country: 'Australia',
      flag: '🇦🇺',
      location: [-33.95, 151.18],
      role: 'Oceania Regional PoP',
      traffic: '720 GB/s',
      reqRate: '210k req/s',
      status: 'Active Route'
    },
    {
      id: 'gru1',
      region: 'gru1',
      city: 'São Paulo',
      country: 'Brazil',
      flag: '🇧🇷',
      location: [-23.43, -46.47],
      role: 'LATAM Aggregation Hub',
      traffic: '890 GB/s',
      reqRate: '310k req/s',
      status: 'Active Route'
    }
  ];

  // Global Edge Backbone Transit Arcs (Cobe CDN traffic pipes)
  const cdnArcs = [
    { id: 'iad-cdg', from: [38.95, -77.45], to: [49.01, 2.55], traffic: '2.4 TB/s' }, // IAD -> CDG
    { id: 'sfo-hnd', from: [37.62, -122.38], to: [35.55, 139.78], traffic: '1.8 TB/s' }, // SFO -> HND
    { id: 'cdg-sin', from: [49.01, 2.55], to: [1.35, 103.82], traffic: '1.2 TB/s' }, // CDG -> SIN
    { id: 'fra-sin', from: [50.11, 8.68], to: [1.35, 103.82], traffic: '1.4 TB/s' }, // FRA -> SIN
    { id: 'hnd-sin', from: [35.55, 139.78], to: [1.35, 103.82], traffic: '1.8 TB/s' }, // HND -> SIN
    { id: 'iad-gru', from: [38.95, -77.45], to: [-23.43, -46.47], traffic: '890 GB/s' }, // IAD -> GRU
    { id: 'hnd-syd', from: [35.55, 139.78], to: [-33.95, 151.18], traffic: '720 GB/s' }, // HND -> SYD
    { id: 'syd-sin', from: [-33.95, 151.18], to: [1.35, 103.82], traffic: '720 GB/s' } // SYD -> SIN
  ];

  const [activePoP, setActivePoP] = useState(edgePoPs[0]);
  const activePoPRef = useRef(edgePoPs[0]);
  activePoPRef.current = activePoP;

  // Live fluctuating req/s traffic numbers like on cobe.vercel.app
  const [cdnTraffic, setCdnTraffic] = useState([
    { id: 'iad-cdg', value: 420 },
    { id: 'sfo-hnd', value: 380 },
    { id: 'cdg-sin', value: 290 },
    { id: 'fra-sin', value: 340 },
    { id: 'hnd-sin', value: 410 },
    { id: 'iad-gru', value: 185 },
    { id: 'hnd-syd', value: 156 },
    { id: 'syd-sin', value: 134 }
  ]);

  // Self-updating live request rates (every 300ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCdnTraffic(prev =>
        prev.map(t => ({
          ...t,
          value: Math.max(80, t.value + Math.floor(Math.random() * 21) - 10)
        }))
      );
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const totalMeshReqs = useMemo(() => {
    const sum = cdnTraffic.reduce((acc, curr) => acc + curr.value, 0);
    return `${(sum / 1000).toFixed(2)}M req/s`;
  }, [cdnTraffic]);

  // Rotate globe smoothly to focus on selected Edge PoP
  const focusOnPoP = (pop) => {
    setActivePoP(pop);
    const lonRad = (pop.location[1] * Math.PI) / 180;
    const latRad = (pop.location[0] * Math.PI) / 180;
    
    // Set target phi and theta to bring location directly to front center
    targetPhiRef.current = -lonRad - Math.PI / 2;
    targetThetaRef.current = Math.max(-0.4, Math.min(0.4, latRad * 0.5));
    onSay?.(`PoP Focused: ${pop.region} (${pop.city}, ${pop.country}) · Ingress: ${pop.traffic}`);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const buildMarkers = (focusId) => edgePoPs.map(p => ({
      id: p.id,
      location: p.location,
      size: p.isHQ ? 0.065 : (p.id === focusId ? 0.06 : 0.038),
      color: p.isHQ 
        ? [0.1, 0.85, 0.5] 
        : (p.id === focusId ? [0.95, 0.33, 0.18] : [0.22, 0.74, 0.97])
    }));

    // Build arcs list for Cobe CDN mode
    const arcs = cdnArcs.map(a => ({
      id: a.id,
      from: a.from,
      to: a.to,
      color: [0.25, 0.65, 0.98]
    }));

    // Initialize Cobe Globe once on mount with 0.00 markerElevation
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 270,
      height: 270,
      phi: 0,
      theta: 0.15,
      dark: 1,
      diffuse: 2.2,
      scale: 1.05,
      mapSamples: 16000,
      mapBrightness: 8.5,
      baseColor: [0.08, 0.12, 0.18],
      markerColor: [0.22, 0.74, 0.97],
      glowColor: [0.15, 0.45, 0.85],
      markers: buildMarkers(activePoPRef.current?.id),
      arcs: arcs,
      arcColor: [0.35, 0.75, 1.0],
      arcWidth: 0.55,
      arcHeight: 0.28,
      markerElevation: 0.00
    });

    let animationFrameId;
    let lastRenderedPoPId = activePoPRef.current?.id;

    // Continuous 60 FPS animation loop driving cobe v2
    const renderLoop = () => {
      // Smooth physics damping toward target
      phiRef.current += (targetPhiRef.current - phiRef.current) * 0.08;
      thetaRef.current += (targetThetaRef.current - thetaRef.current) * 0.08;

      // Auto-rotate gently if user is not currently dragging
      if (!isInteractingRef.current) {
        targetPhiRef.current += 0.0025;
      }

      const currentPoPId = activePoPRef.current?.id;
      if (currentPoPId !== lastRenderedPoPId) {
        lastRenderedPoPId = currentPoPId;
        globe.update({
          phi: phiRef.current,
          theta: thetaRef.current,
          markers: buildMarkers(currentPoPId)
        });
      } else {
        globe.update({
          phi: phiRef.current,
          theta: thetaRef.current
        });
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      globe.destroy();
    };
  }, []);

  // Pointer drag controls with natural 2D orientation (dragging down tilts DOWN!)
  const handlePointerDown = (e) => {
    isInteractingRef.current = true;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
      try {
        canvasRef.current.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerUp = (e) => {
    isInteractingRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
      try {
        canvasRef.current.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e) => {
    if (isInteractingRef.current) {
      const deltaX = e.clientX - pointerStart.current.x;
      const deltaY = e.clientY - pointerStart.current.y;
      pointerStart.current = { x: e.clientX, y: e.clientY };

      // Horizontal drag rotates yaw (phi)
      targetPhiRef.current += deltaX * 0.007;

      // FIX: Vertical drag rotates pitch (theta) naturally - dragging down tilts down!
      targetThetaRef.current = Math.max(
        -0.65,
        Math.min(0.65, targetThetaRef.current + deltaY * 0.006)
      );
    }
  };

  return (
    <article className="panel threat-map">
      {/* Header */}
      <header className="panel-heading">
        <div>
          <h2 className="font-display">Global Edge Traffic & Scrubbing Mesh</h2>
          <p>Real-time ingress requests across 8 Global Edge PoPs routed to Singapore HQ</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-emerald animate-pulse-subtle" />
            {totalMeshReqs} Mesh
          </span>
          <button 
            className="quiet-link"
            onClick={() => onNavigate?.('Threats')}
          >
            View queue <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Cobe 3D Globe Interactive Stage in CDN Mode */}
      <div className="cobe-globe-container">
        <div className="cobe-canvas-wrapper">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerMove={handlePointerMove}
            className="cobe-canvas"
          />
        </div>

        {/* Cobe CSS Anchor Positioning Labels for Region Markers (Vercel CDN showcase style) */}
        {edgePoPs.map(pop => (
          <div
            key={pop.id}
            className="cobe-cdn-marker-badge"
            style={{
              positionAnchor: `--cobe-${pop.id}`,
              opacity: `var(--cobe-visible-${pop.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${pop.id}, 0)) * 6px))`
            }}
          >
            <span className={`cobe-cdn-dot ${pop.isHQ ? 'hq' : ''}`} />
            <span className="cobe-cdn-text">{pop.region}</span>
          </div>
        ))}

        {/* Animated CDN Arc Traffic Labels (Cobe official cobe.vercel.app style) */}
        {cdnTraffic.map(t => (
          <div
            key={t.id}
            className="showcase-cdn-arc-label"
            style={{
              positionAnchor: `--cobe-arc-${t.id}`,
              opacity: `var(--cobe-visible-arc-${t.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-arc-${t.id}, 0)) * 6px))`
            }}
          >
            {t.value}k req/s
          </div>
        ))}

        {/* Floating status & drag hint */}
        <div className="cobe-overlay-info">
          <span className="cobe-live-indicator">
            <span className="w-2 h-2 rounded-full bg-signal-emerald animate-pulse-subtle inline-block" />
            8 Edge Nodes Synchronized
          </span>
          <span className="cobe-hint-text">
            Drag to rotate 360°
          </span>
        </div>
      </div>

      {/* Selected Edge Node Dossier Panel */}
      {activePoP && (
        <div className="threat-dossier-bar">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl">{activePoP.flag}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <b className="truncate block font-display text-slate-900 text-xs">
                  {activePoP.region} · {activePoP.city}, {activePoP.country}
                </b>
                {activePoP.isHQ && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                    CORE HQ
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-600 block truncate mt-0.5">
                Role: <strong>{activePoP.role}</strong> · Status: <strong className="text-signal-emerald font-medium">{activePoP.status}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-emerald animate-pulse-subtle" />
              {cdnTraffic.find(t => t.id.includes(activePoP.id.slice(0, 3)))?.value || 420}k req/s
            </span>
            <button
              type="button"
              className="dossier-block-btn"
              onClick={() => onSay?.(`DDoS Scrubbing Profile updated for ${activePoP.region} (${activePoP.city}).`)}
            >
              Tune PoP Rules
            </button>
          </div>
        </div>
      )}

      {/* Global Edge PoPs Traffic Roster with Click-to-Focus */}
      <div className="origin-ranks">
        {edgePoPs.slice(0, 4).map(pop => {
          const isSelected = activePoP?.id === pop.id;
          const liveVal = cdnTraffic.find(t => t.id.includes(pop.id.slice(0, 3)))?.value || 380;
          return (
            <button
              key={pop.id}
              type="button"
              className={isSelected ? 'bg-slate-100 border-slate-300 ring-1 ring-slate-300' : ''}
              onClick={() => focusOnPoP(pop)}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{pop.flag}</span>
                <b className="text-slate-900 font-display">{pop.region}</b>
              </span>
              <span className="font-semibold text-slate-800 text-xs">{pop.city}</span>
              <span className="text-[11px] text-slate-500 font-mono ml-auto">
                {liveVal}k req/s
              </span>
              <span className="text-xs font-bold text-signal-blue font-mono ml-3">
                {pop.traffic}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
