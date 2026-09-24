import React, { useState, useRef, useMemo } from 'react';
import { 
  ArrowRight, 
  LockKeyhole, 
  ShieldCheck, 
  Zap, 
  Key, 
  Eye, 
  EyeOff, 
  RefreshCw,
  UserCheck
} from 'lucide-react';

export default function LoginPage({ onSignIn }) {
  // Preset personas for 1-click testing
  const personas = [
    {
      id: 'analyst',
      label: 'SOC Analyst',
      name: 'Security Analyst',
      email: 'analyst@sentinel.io',
      role: 'Tier 2 Incident Responder',
      password: 'sentinel-soc-2026'
    },
    {
      id: 'secops',
      label: 'Perimeter SecOps',
      name: 'SecOps Engineer',
      email: 'secops@sentinel.io',
      role: 'Edge Firewall Administrator',
      password: 'edge-secops-mesh'
    },
    {
      id: 'commander',
      label: 'Commander',
      name: 'Incident Commander',
      email: 'commander@sentinel.io',
      role: 'CISO / Incident Command',
      password: 'zero-trust-root'
    }
  ];

  const [activePersona, setActivePersona] = useState('analyst');
  const [email, setEmail] = useState(personas[0].email);
  const [password, setPassword] = useState(personas[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState('');

  const cardRef = useRef(null);

  // Ethereal floating stardust particles for living atmosphere
  const stardustParticles = useMemo(() => [
    { x: 8, y: 22, size: 2, duration: 16, minOp: 0.15, maxOp: 0.5 },
    { x: 18, y: 68, size: 1.5, duration: 14, minOp: 0.2, maxOp: 0.6 },
    { x: 26, y: 15, size: 2, duration: 18, minOp: 0.1, maxOp: 0.45 },
    { x: 38, y: 82, size: 2.5, duration: 12, minOp: 0.25, maxOp: 0.7 },
    { x: 48, y: 28, size: 1.5, duration: 15, minOp: 0.18, maxOp: 0.55 },
    { x: 58, y: 74, size: 2, duration: 20, minOp: 0.12, maxOp: 0.4 },
    { x: 67, y: 19, size: 2, duration: 13, minOp: 0.2, maxOp: 0.65 },
    { x: 78, y: 88, size: 1.5, duration: 17, minOp: 0.15, maxOp: 0.5 },
    { x: 86, y: 32, size: 2.5, duration: 19, minOp: 0.22, maxOp: 0.6 },
    { x: 92, y: 62, size: 1.5, duration: 14, minOp: 0.15, maxOp: 0.45 },
    { x: 14, y: 44, size: 2, duration: 16, minOp: 0.18, maxOp: 0.5 },
    { x: 72, y: 52, size: 1.5, duration: 18, minOp: 0.1, maxOp: 0.4 }
  ], []);

  // Interactive mouse tracking: Card specular spotlight + Horizon beam horizontal parallax
  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }

    // Parallax shift for Living Horizon Beam
    const pctX = Math.round((e.clientX / window.innerWidth) * 100);
    document.documentElement.style.setProperty('--horizon-x', `${pctX}%`);
  };

  const handleSelectPersona = (p) => {
    setActivePersona(p.id);
    setEmail(p.email);
    setPassword(p.password);
    setError('');
  };

  const selectedPersona = personas.find(p => p.id === activePersona) || personas[0];

  const passwordEntropy = useMemo(() => {
    if (!password) return { score: 0, label: 'Empty Passphrase', color: '#64748B', percent: 0 };
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    if (score < 40) {
      return { score, label: 'Basic Key', color: '#F59E0B', percent: 35 };
    }
    if (score < 75) {
      return { score, label: 'Standard Entropy', color: '#38BDF8', percent: 70 };
    }
    return { score, label: 'Zero-Trust Hardened', color: '#34D399', percent: 100 };
  }, [password]);

  const handleSubmit = (event) => {
    event?.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please provide a valid enterprise security email address.');
      triggerShake();
      return;
    }
    if (password.length < 6) {
      setError('Authentication passphrase must be at least 6 characters.');
      triggerShake();
      return;
    }

    setAuthenticating(true);
    setAuthStep('Verifying TLS 1.3 Handshake...');

    setTimeout(() => {
      setAuthStep('Validating Zero-Trust Token...');
    }, 280);

    setTimeout(() => {
      const personaMatch = personas.find(p => p.email === email);
      const derivedName = personaMatch 
        ? personaMatch.name 
        : email.split('@')[0].split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

      onSignIn({ 
        name: derivedName || 'Security Analyst', 
        email,
        role: personaMatch?.role || 'Security Specialist'
      });
    }, 620);
  };

  const handleInstantSignIn = () => {
    onSignIn({ 
      name: selectedPersona.name, 
      email: selectedPersona.email, 
      role: selectedPersona.role 
    });
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <main className="login-shell" onMouseMove={handleMouseMove}>
      {/* Horizon Light Beam: Living Apple VisionOS Atmosphere (Serene & Clean) */}
      <div className="horizon-beam" aria-hidden="true" />

      {/* Ethereal Floating Stardust Particles */}
      <div className="stardust-field" aria-hidden="true">
        {stardustParticles.map((s, idx) => (
          <div
            key={idx}
            className="stardust-particle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              '--duration': `${s.duration}s`,
              '--min-op': s.minOp,
              '--max-op': s.maxOp
            }}
          />
        ))}
      </div>

      {/* Ambient Floating Ethereal Orbs */}
      <div className="liquid-orb-container" aria-hidden="true">
        <div className="liquid-orb orb-blue" />
        <div className="liquid-orb orb-coral" />
        <div className="liquid-orb orb-slate" />
      </div>

      {/* Fullscreen Centered Unified Grid */}
      <div className="login-container">
        {/* Left Console: Sentinel Brand & Elegant Narrative (Spacious, Serene & Restful) */}
        <section className="login-intro">
          {/* Brand Icon & Text */}
          <div className="login-brand">
            <span className="login-brand-icon">
              <ShieldCheck size={22} />
            </span>
            <span className="login-brand-text">SENTINEL DEFENSE</span>
          </div>

          <div>
            <h1>Know what needs attention. Act with precision.</h1>
            <p>
              An instrument-grade telemetry console for real-time packet inspection, credential brute-force mitigation, and zero-trust asset containment.
            </p>
          </div>

          <div className="login-footer-disclaimer">
            <LockKeyhole size={15} className="text-slate-400" />
            <span>Local demonstration session · Cryptographic telemetry remains in this browser</span>
          </div>
        </section>

        {/* Right Console: Apple VisionOS Dark Liquid Glass Card */}
        <section className="login-card-wrapper">
          <div 
            ref={cardRef}
            className={`liquid-glass-card ${shake ? 'shake-error' : ''}`}
          >
            {/* Card Header */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 text-signal-coral flex items-center justify-center shadow-sm">
                  <ShieldCheck size={22} />
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 shadow-sm">
                  SSO Enabled
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-display tracking-tight">
                Analyst Authentication
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-normal leading-relaxed">
                Connect your verified security credentials to inspect edge telemetry.
              </p>
            </div>

            {/* Interactive Role Switcher Tabs */}
            <div>
              <div className="role-tabs">
                {personas.map(p => {
                  const isActive = activePersona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPersona(p)}
                      className={`role-tab ${isActive ? 'active' : ''}`}
                    >
                      {p.id === 'analyst' && <ShieldCheck size={13} />}
                      {p.id === 'secops' && <Zap size={13} />}
                      {p.id === 'commander' && <Key size={13} />}
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Identity Pill preview */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs mb-4">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <UserCheck size={13} className="text-sky-400" />
                  <span className="text-white font-semibold">{selectedPersona.name}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">{selectedPersona.role}</span>
              </div>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-xs font-semibold text-slate-200 block mb-1.5">
                  Work Email Address
                </label>
                <div className="glass-input-wrap">
                  <input 
                    id="login-email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    type="email"
                    autoComplete="email"
                    placeholder="analyst@sentinel.io"
                    required
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-semibold text-slate-200">
                    Workspace Passphrase
                  </label>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    Entropy Check
                  </span>
                </div>
                <div className="glass-input-wrap">
                  <input 
                    id="login-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    required
                    className="glass-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                    aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength & Entropy Meter */}
                <div className="entropy-meter-wrap">
                  <div className="entropy-bar-track">
                    <div 
                      className="entropy-bar-fill"
                      style={{ 
                        width: `${passwordEntropy.percent}%`,
                        backgroundColor: passwordEntropy.color 
                      }}
                    />
                  </div>
                  <div className="entropy-legend">
                    <span>Strength: <strong style={{ color: passwordEntropy.color }}>{passwordEntropy.label}</strong></span>
                    <span>AES-256 GCM</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="login-error text-xs font-mono font-medium text-rose-400" role="alert">
                  {error}
                </p>
              )}

              {/* Zero-Trust Handshake Submit Button */}
              <button 
                className="liquid-submit-btn" 
                type="submit"
                disabled={authenticating}
              >
                {authenticating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-slate-900" />
                    <span>{authStep}</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Workspace</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Instant Access */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col items-center gap-2 text-center">
              <button
                type="button"
                onClick={handleInstantSignIn}
                className="w-full py-2.5 px-3 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-xs text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Zap size={14} className="text-signal-coral" />
                Instant Sign In as {selectedPersona.label}
              </button>
              <small className="text-xs text-slate-400 font-medium">
                Demo mode: You can also switch roles at any time from the top profile menu.
              </small>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
