import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Network, 
  Terminal, 
  Laptop, 
  FileSearch, 
  Download, 
  UserRound, 
  Settings, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Plus, 
  ArrowRight, 
  Command, 
  ChevronRight, 
  Activity, 
  Zap, 
  Gauge, 
  Flame,
  Radio,
  Server,
  Search
} from 'lucide-react';

// Modular Components
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import { SentinelVerticalDock } from './components/ui/dock';
import NetworkTraffic from './components/NetworkTraffic';
import SystemPosture from './components/SystemPosture';
import NetworkTopology from './components/NetworkTopology';
import BruteForceMonitor from './components/BruteForceMonitor';
import MalwareDetection from './components/MalwareDetection';
import ThreatRadarMap from './components/ThreatRadarMap';
import IncidentBoard from './components/IncidentBoard';
import AlertPanel from './components/AlertPanel';
import IncidentModal from './components/IncidentModal';
import AssetsView from './components/AssetsView';
import ReportsView from './components/ReportsView';
import StatCard from './components/StatCard';
import LoginPage from './components/LoginPage';
import { appleSprings } from './lib/fluidMotion';
import { audioEngine } from './lib/audioEngine';
import confetti from 'canvas-confetti';

// Persistent storage services
import { 
  clearSession, 
  loadAlerts, 
  loadSession, 
  saveAlerts, 
  saveSession,
  loadTopology,
  saveTopology
} from './services/securityStore';

const pages = {
  Overview: [LayoutDashboard, 'Unified telemetry stream and real-time defense posture.'],
  Threats: [ShieldAlert, 'Incident triage lifecycle and active threat mitigation.'],
  Network: [Network, 'Gateway packet inspection, throughput, and connection telemetry.'],
  'Brute Force': [Terminal, 'Credential stuffing mitigation and geographic origin velocity.'],
  Assets: [Laptop, 'Zero-trust coverage across managed organization endpoints.'],
  'Malware detection': [FileSearch, 'Client-side metadata sandbox and heuristic entropy analysis.'],
  Reports: [Download, 'Exportable shift briefs and compliance audit records.'],
  Profile: [UserRound, 'Analyst workspace identity and security credentials.'],
  Settings: [Settings, 'Local session preferences and real-time streaming rules.']
};

export default function App() {
  const [session, setSession] = useState(loadSession);
  const [page, setPage] = useState('Overview');
  const [alerts, setAlerts] = useState(loadAlerts);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('24h');
  const [live, setLive] = useState(true);
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [toast, setToast] = useState('');
  
  // Track topology isolation state centrally
  const [isServerIsolated, setIsServerIsolated] = useState(() => loadTopology().isolated);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState('Sentinel HQ');

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Persist alerts
  useEffect(() => {
    saveAlerts(alerts);
  }, [alerts]);

  // Global Keyboard shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const say = (text) => setToast(text);

  const navigate = (name) => {
    setPage(name);
    say(`${name} workspace opened.`);
  };

  const signIn = (user) => {
    saveSession(user);
    setSession(user);
  };

  const signOut = () => {
    clearSession();
    setSession(null);
  };

  const simulateThreat = () => {
    audioEngine.alertChirp();
    const vectors = [
      { title: 'Anomalous egress burst', source: '91.214.124.19', country: 'Unknown source', detail: 'Outbound flow exceeded learned baseline by 190% over port 443.' },
      { title: 'Encrypted C2 beaconing', source: '185.220.101.99', country: 'Netherlands', detail: 'Regular 60s jittered telemetry matched Cobalt Strike listener profile.' },
      { title: 'Brute force SSH spike', source: '45.155.205.12', country: 'Russia', detail: '54 invalid password attempts targeted root on Edge Gateway within 30s.' },
      { title: 'Reverse shell injection', source: '103.78.213.88', country: 'Indonesia', detail: 'Suspicious base64 command execution attempted on internal host.' }
    ];
    const picked = vectors[Math.floor(Math.random() * vectors.length)];
    const newAlert = {
      id: Date.now(),
      title: picked.title,
      source: picked.source,
      country: picked.country,
      severity: Math.random() > 0.4 ? 'Critical' : 'High',
      time: 'Just now',
      detail: picked.detail
    };
    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlert(newAlert);
    say(`New ${newAlert.severity} threat injected: ${newAlert.title}.`);
  };

  const resolveAlert = (id) => {
    audioEngine.successChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#38BDF8', '#10B981', '#F8FAFC']
    });
    setAlerts(prev => prev.filter(a => a.id !== id));
    setSelectedAlert(null);
    say('Incident mitigated and logged to audit trail.');
  };

  const blockSource = (alert) => {
    audioEngine.switchClick(0.1);
    setAlerts(prev => prev.filter(a => a.id !== alert.id));
    setSelectedAlert(null);
    say(`ACL rule deployed: ${alert.source} dropped at edge gateway.`);
  };

  const toggleIsolateServer = () => {
    const next = !isServerIsolated;
    audioEngine.switchClick(0.1);
    setIsServerIsolated(next);
    saveTopology({ isolated: next });
    say(next 
      ? 'Server-Main isolated. Egress route dropped at gateway.' 
      : 'Server-Main network policy restored.'
    );
  };

  // Filter alerts by search query and severity
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchFilter = filter === 'All' || a.severity.toLowerCase() === filter.toLowerCase();
      const matchQuery = `${a.title} ${a.source} ${a.country} ${a.detail}`.toLowerCase().includes(query.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [alerts, filter, query]);

  const urgentCount = alerts.filter(a => a.severity === 'Critical' || a.severity === 'High').length;

  const sentinelNavGroups = useMemo(() => [
    {
      items: [
        { id: 'search', title: 'Quick Action', icon: Search, shortcut: '⌘K' },
        { id: 'Overview', title: 'Defense Operations', icon: LayoutDashboard },
        { id: 'Network', title: 'Gateway Telemetry', icon: Network },
      ]
    },
    {
      heading: 'Threat Response',
      items: [
        { id: 'Threats', title: 'Incident Triage', icon: ShieldAlert, badge: urgentCount > 0 ? urgentCount : undefined },
        { id: 'Brute Force', title: 'Brute Force Stream', icon: Terminal },
      ]
    },
    {
      heading: 'Containment Fleet',
      items: [
        { 
          id: 'Assets', 
          title: 'Zero-Trust Endpoints', 
          icon: Laptop,
          children: [
            { id: 'assets-servers', title: 'Servers (1 Action)', icon: Server },
            { id: 'assets-workstations', title: 'Workstations (Safe)', icon: Laptop },
          ]
        },
        { id: 'Malware detection', title: 'Malware Sandbox', icon: FileSearch },
      ]
    },
    {
      heading: 'Governance & Audit',
      items: [
        { id: 'Reports', title: 'Shift Briefs (PDF)', icon: Download },
      ]
    }
  ], [urgentCount]);

  const sentinelBottomItems = useMemo(() => [
    { id: 'Profile', title: 'Analyst Profile', icon: UserRound },
    { id: 'Settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
    { id: 'logout', title: 'Log out', icon: X },
  ], []);

  const handleNavSelect = (id) => {
    if (id === 'search') {
      setCommandsOpen(true);
      return;
    }
    if (id === 'logout') {
      signOut();
      return;
    }
    if (id === 'assets-servers' || id === 'assets-workstations') {
      navigate('Assets');
      return;
    }
    navigate(id);
  };

  if (!session) {
    return <LoginPage onSignIn={signIn} />;
  }

  return (
    <div className="app-shell bg-[#080A0F] text-[#F8FAFC] min-h-screen">
      {/* Vertical macOS Floating Dock with Wave Magnification */}
      <SentinelVerticalDock 
        activePage={page} 
        onNavigate={navigate} 
        urgentCount={urgentCount} 
      />

      {/* Mobile Bottom Navigation Strip */}
      <nav className="rail md:hidden" aria-label="Mobile Navigation">
        <div className="workspace-nav">
          {Object.entries(pages).map(([name, [Icon]]) => {
            const isActive = page === name;
            return (
              <button
                key={name}
                className={isActive ? 'active' : ''}
                onClick={() => navigate(name)}
              >
                <Icon size={16} />
                <span>{name}</span>
                {name === 'Threats' && urgentCount > 0 && (
                  <b>{urgentCount}</b>
                )}
                {name === 'Brute Force' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-signal-coral animate-pulse-subtle" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main App Container with Dedicated Left Gutter for Floating Dock */}
      <main className="main-content ml-0 md:ml-20 transition-all duration-300">
        {/* Topbar Navigation */}
        <Header 
          page={page}
          onNavigate={navigate}
          query={query}
          setQuery={setQuery}
          alerts={alerts}
          onOpenCommands={() => setCommandsOpen(true)}
          onOpenProfile={() => navigate('Profile')}
          session={session}
          live={live}
          onSay={say}
          activeWorkspace={activeWorkspace}
        />

        {/* Canvas Body */}
        <div className="canvas">
          {/* Operations Cockpit Header - Clean & Focused */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${live ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <h1 className="text-lg md:text-xl font-bold font-display text-white tracking-tight">
                {page === 'Overview' ? 'Cyber Defense Cockpit' : page}
              </h1>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">· AS13335 Edge Node</span>
            </div>

            <div className="flex items-center gap-2">
              <motion.button 
                whileTap={appleSprings.tapPress}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5"
                onClick={() => {
                  audioEngine.tick(0.04);
                  setLive(!live);
                  say(live ? 'Sensor stream paused.' : 'Sensor stream resumed.');
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                {live ? 'Live Sensor' : 'Paused'}
              </motion.button>
              <motion.button 
                whileHover={appleSprings.hoverElevate}
                whileTap={appleSprings.tapPress}
                className="px-3 py-1 rounded-md bg-red-600/90 hover:bg-red-600 border border-red-500/50 text-white text-xs font-semibold shadow-md shadow-red-900/30 transition-all flex items-center gap-1"
                onClick={simulateThreat}
              >
                <Plus size={13} /> Simulate
              </motion.button>
            </div>
          </section>

          {/* Dynamic Page Switcher with Smooth View Transition */}
          <div key={page} className="view-transition">
            {page === 'Overview' && (
              <OverviewPage 
                alerts={filteredAlerts}
                allAlerts={alerts}
                filter={filter}
                setFilter={setFilter}
                onSelectAlert={setSelectedAlert}
                period={period}
                setPeriod={setPeriod}
                onSay={say}
                onNavigate={navigate}
                onSimulate={simulateThreat}
                isServerIsolated={isServerIsolated}
                setIsServerIsolated={setIsServerIsolated}
              />
            )}

            {page === 'Threats' && (
              <IncidentBoard 
                alerts={filteredAlerts}
                allAlerts={alerts}
                filter={filter}
                setFilter={setFilter}
                onSelectAlert={setSelectedAlert}
                onSimulate={simulateThreat}
                onSay={say}
              />
            )}

            {page === 'Network' && (
              <div className="space-y-6">
                <NetworkTraffic 
                  period={period}
                  setPeriod={setPeriod}
                  onSay={say}
                />
                <NetworkTopology 
                  onSay={say}
                  isolatedState={isServerIsolated}
                  setIsolatedState={setIsServerIsolated}
                />
              </div>
            )}

            {page === 'Brute Force' && (
              <BruteForceMonitor onSay={say} />
            )}

            {page === 'Assets' && (
              <AssetsView onSay={say} />
            )}

            {page === 'Malware detection' && (
              <MalwareDetection onSay={say} />
            )}

            {page === 'Reports' && (
              <ReportsView onSay={say} />
            )}

            {page === 'Profile' && (
              <ProfilePage 
                session={session}
                setSession={setSession}
                onSay={say}
              />
            )}

            {page === 'Settings' && (
              <SettingsPage 
                onSay={say}
                onSignOut={signOut}
              />
            )}
          </div>
        </div>
      </main>

      {/* Incident Detail Modal with Fluid Presentation */}
      <AnimatePresence>
        {selectedAlert && (
          <IncidentModal 
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
            onBlock={blockSource}
            onResolve={resolveAlert}
          />
        )}
      </AnimatePresence>

      {/* Interactive Command Palette */}
      <CommandPalette 
        isOpen={commandsOpen}
        onClose={() => setCommandsOpen(false)}
        onNavigate={navigate}
        onSimulate={simulateThreat}
        onIsolateServer={toggleIsolateServer}
        isServerIsolated={isServerIsolated}
        onSay={say}
        alerts={alerts}
      />

      {/* Floating System Toast Feedback with Fluid Spring */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={appleSprings.dropdown}
            className="toast" 
            role="status"
          >
            <CheckCircle2 size={16} />
            <span>{toast}</span>
            <button onClick={() => setToast('')} aria-label="Close notification">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------
// SUB-VIEWS & PAGES
// ----------------------------------------------------

function OverviewPage({ 
  alerts, 
  allAlerts, 
  filter, 
  setFilter, 
  onSelectAlert, 
  period, 
  setPeriod, 
  onSay, 
  onNavigate, 
  onSimulate,
  isServerIsolated,
  setIsServerIsolated 
}) {
  return (
    <div className="space-y-4">
      {/* Bento Row 1: Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard 
          label="Risk Posture"
          value="Low"
          note="38 / 39 checks nominal"
          icon={<Gauge size={18} />}
          tone="neutral"
          onClick={() => onSay('Risk posture calculated at 94/100.')}
        />

        <StatCard 
          label="Active Threat Queue"
          value={allAlerts.length}
          note="Requires analyst triage"
          icon={<ShieldAlert size={18} />}
          tone="coral"
          urgent={allAlerts.length > 0}
          trend={{ type: 'up', value: '+2' }}
          onClick={() => onNavigate('Threats')}
        />

        <StatCard 
          label="Blocked Today"
          value="1,284"
          note="Automated edge ACLs"
          icon={<Zap size={18} />}
          tone="neutral"
          trend={{ type: 'neutral', value: '+18.2%' }}
          onClick={() => onSay('1,284 malicious requests rejected today.')}
        />

        <StatCard 
          label="Secure Endpoints"
          value="24 / 25"
          note={isServerIsolated ? "1 quarantined host" : "1 needs patch"}
          icon={<Laptop size={18} />}
          tone="neutral"
          onClick={() => onNavigate('Assets')}
        />
      </section>

      {/* 12-Column Bento Grid Cockpit Layout */}
      <div className="bento-grid">
        {/* Bento 1: Live Gateway Dual-Stream Telemetry (7 Col) */}
        <div className="col-span-12 lg:col-span-7">
          <NetworkTraffic 
            period={period}
            setPeriod={setPeriod}
            onSay={onSay}
          />
        </div>

        {/* Bento 2: 3D Global Edge Mesh Cobe Globe (5 Col) */}
        <div className="col-span-12 lg:col-span-5">
          <ThreatRadarMap 
            onSay={onSay}
            onNavigate={onNavigate}
          />
        </div>

        {/* Bento 3: Network Topology & Host Containment (7 Col) */}
        <div className="col-span-12 lg:col-span-7">
          <NetworkTopology 
            onSay={onSay}
            isolatedState={isServerIsolated}
            setIsolatedState={setIsServerIsolated}
          />
        </div>

        {/* Bento 4: Priority Threat Signal Feed (5 Col) */}
        <div className="col-span-12 lg:col-span-5">
          <AlertPanel 
            alerts={alerts}
            allAlerts={allAlerts}
            filter={filter}
            setFilter={setFilter}
            onSelectAlert={onSelectAlert}
            onSimulate={onSimulate}
          />
        </div>

        {/* Bento 5: System Posture & Remediation Checklist (7 Col) */}
        <div className="col-span-12 lg:col-span-7">
          <SystemPosture onSay={onSay} />
        </div>

        {/* Bento 6: Brute Force Velocity Quick Terminal (5 Col) */}
        <div className="col-span-12 lg:col-span-5">
          <article className="panel flex flex-col justify-between h-full bg-[#0D1117] border border-white/[0.08]">
            <header className="panel-heading">
              <div>
                <h2 className="text-white font-display text-base">Brute Force Ingress Velocity</h2>
                <p className="text-slate-400 text-xs">Credential stuffing mitigation rate</p>
              </div>
              <button 
                className="quiet-link text-sky-400" 
                onClick={() => {
                  audioEngine.tick(0.04);
                  onNavigate('Brute Force');
                }}
              >
                Full log <ArrowRight size={13} />
              </button>
            </header>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] my-2">
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-400">Current Ingress Velocity</span>
                <span className="font-bold text-red-400">3.8 reqs/sec</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-3/4 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Top Targeted Service</span>
                <span className="font-mono font-semibold text-slate-200">SSH Port 22 (74%)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Primary Vector Origin</span>
                <span className="font-mono font-semibold text-slate-200">China / Russia (58%)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400">Automated Mitigation</span>
                <span className="font-mono font-semibold text-emerald-400">100% Blocked</span>
              </div>
            </div>

            <button 
              className="secondary-btn text-xs w-full mt-4 justify-center"
              onClick={() => {
                audioEngine.tick(0.04);
                onNavigate('Brute Force');
              }}
            >
              Open Brute Force Monitor <ArrowRight size={13} />
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ session, setSession, onSay }) {
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);

  const save = (e) => {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      return onSay('Please provide a valid display name and email address.');
    }
    const updated = { name: name.trim(), email };
    saveSession(updated);
    setSession(updated);
    onSay('Profile updated successfully.');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="panel flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg font-mono">
          {name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-primary font-display">{name}</h2>
          <p className="text-xs text-ink-secondary">{email}</p>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-signal-emerald font-mono mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-emerald" /> Authenticated via Sentinel Zero Trust
          </span>
        </div>
      </div>

      <div className="panel">
        <header className="panel-heading">
          <div>
            <h2>Analyst Profile Information</h2>
            <p>Identity used in threat audit signatures and shift containment records</p>
          </div>
        </header>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-primary block mb-1.5">Display Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-2.5 rounded-lg border border-ink-border bg-slate-50 text-xs outline-none focus:border-signal-blue"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-primary block mb-1.5">Work Email</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email"
              className="w-full p-2.5 rounded-lg border border-ink-border bg-slate-50 text-xs outline-none focus:border-signal-blue"
            />
          </div>

          <button className="primary-btn text-xs" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsPage({ onSay, onSignOut }) {
  const [liveStream, setLiveStream] = useState(true);
  const [audioCue, setAudioCue] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="panel">
        <header className="panel-heading">
          <div>
            <h2>Workspace Preferences</h2>
            <p>Control live telemetry updates, threat audio signals, and notification feeds</p>
          </div>
        </header>

        <div className="divide-y divide-ink-border">
          <div className="py-3 flex items-center justify-between">
            <div>
              <b className="text-xs text-ink-primary block">Real-time Ingress Stream</b>
              <small className="text-[11px] text-ink-muted">Continuously update simulated telemetry while tab is active.</small>
            </div>
            <button 
              onClick={() => {
                setLiveStream(!liveStream);
                onSay(`Ingress stream ${!liveStream ? 'enabled' : 'paused'}.`);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative ${liveStream ? 'bg-signal-emerald' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${liveStream ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <b className="text-xs text-ink-primary block">Audio Alert Cues</b>
              <small className="text-[11px] text-ink-muted">Play short tone for incoming Critical priority detections.</small>
            </div>
            <button 
              onClick={() => {
                setAudioCue(!audioCue);
                onSay(`Audio alert cues ${!audioCue ? 'enabled' : 'disabled'}.`);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative ${audioCue ? 'bg-signal-emerald' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${audioCue ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <b className="text-xs text-ink-primary block">Handoff Briefing Digest</b>
              <small className="text-[11px] text-ink-muted">Display shift summaries in notification feed.</small>
            </div>
            <button 
              onClick={() => {
                setDailyDigest(!dailyDigest);
                onSay(`Handoff digest ${!dailyDigest ? 'enabled' : 'disabled'}.`);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative ${dailyDigest ? 'bg-signal-emerald' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${dailyDigest ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="panel border-signal-coral/30">
        <header className="panel-heading">
          <div>
            <h2>Session Management</h2>
            <p>End the local analyst session and return to workspace sign in</p>
          </div>
        </header>

        <button 
          className="block-btn text-xs"
          onClick={onSignOut}
        >
          Sign Out of Workspace
        </button>
      </div>
    </div>
  );
}
