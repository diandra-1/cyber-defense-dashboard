import React, { useEffect, useMemo, useState } from 'react';
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
  Server
} from 'lucide-react';

// Modular Components
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
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
    setAlerts(prev => prev.filter(a => a.id !== id));
    setSelectedAlert(null);
    say('Incident mitigated and logged to audit trail.');
  };

  const blockSource = (alert) => {
    setAlerts(prev => prev.filter(a => a.id !== alert.id));
    setSelectedAlert(null);
    say(`ACL rule deployed: ${alert.source} dropped at edge gateway.`);
  };

  const toggleIsolateServer = () => {
    const next = !isServerIsolated;
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

  if (!session) {
    return <LoginPage onSignIn={signIn} />;
  }

  return (
    <div className="app-shell">
      {/* Architectural Charcoal Sidebar (Aura.build discipline) */}
      <aside className="rail">
        <button className="brand" onClick={() => navigate('Overview')}>
          <span className="brand-glyph">
            <ShieldCheck size={18} />
          </span>
          <span className="brand-title">sentinel</span>
        </button>

        <p className="rail-label">Operational Workspace</p>

        <nav className="workspace-nav">
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
        </nav>

        {/* Rail Footer with Command Quick Launch & Posture */}
        <div className="rail-footer">
          <button 
            className="command-launch"
            onClick={() => setCommandsOpen(true)}
          >
            <Command size={15} />
            <div className="min-w-0">
              <b>Quick Command</b>
              <small>Spotlight actions</small>
            </div>
            <kbd>⌘K</kbd>
          </button>

          <button 
            className="posture-mini"
            onClick={() => say('Defense Score is 94/100. 1 update pending on Server-Main.')}
          >
            <div>
              <small>DEFENSE POSTURE</small>
              <strong>94<i>/100</i></strong>
              <em>
                <span /> Optimal
              </em>
            </div>
            <div className="mini-ring" />
          </button>

          <button 
            className="analyst-badge"
            onClick={() => navigate('Profile')}
          >
            <div className="analyst-avatar">
              {session.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <b className="truncate">{session.name}</b>
              <small className="truncate">{session.email}</small>
            </div>
            <ChevronRight size={14} className="text-slate-500 ml-auto" />
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <main className="main-content">
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
        />

        {/* Canvas Body */}
        <div className="canvas">
          {/* Operations Hero Bar */}
          <section className="hero">
            <div>
              <p className="eyebrow">
                <span className={live ? 'live-ping' : 'paused'} />
                {live ? 'Live Sensor Telemetry' : 'Monitoring Paused'} · {page.toUpperCase()}
              </p>
              <h1>
                {page === 'Overview' ? 'Network Defense Operations' : page}
              </h1>
              <p>{pages[page][1]}</p>
            </div>

            <div className="hero-actions">
              <button 
                className="monitor-btn"
                onClick={() => {
                  setLive(!live);
                  say(live ? 'Live stream paused.' : 'Live stream resumed.');
                }}
              >
                <span className={live ? 'live-ping' : 'paused'} />
                {live ? 'Monitoring Active' : 'Stream Paused'}
              </button>
              <button 
                className="primary-btn"
                onClick={simulateThreat}
              >
                <Plus size={15} /> Simulate Event
              </button>
            </div>
          </section>

          {/* Status Banner */}
          <section className="status-banner">
            <span className="shield-icon">
              <ShieldCheck size={18} />
            </span>
            <span>
              <b>Core perimeter defenses operating normally.</b> 248 active connection flows observed across Edge Gateway.
            </span>
            <button onClick={() => say('Gateway latency: 1.2ms. BGP peer convergence: 100%.')}>
              View Telemetry Health <ArrowRight size={13} />
            </button>
          </section>

          {/* Dynamic Page Switcher */}
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
      </main>

      {/* Incident Detail Modal */}
      {selectedAlert && (
        <IncidentModal 
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onBlock={blockSource}
          onResolve={resolveAlert}
        />
      )}

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

      {/* Floating System Toast Feedback */}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
          <button onClick={() => setToast('')} aria-label="Close notification">
            <X size={14} />
          </button>
        </div>
      )}
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
    <div className="space-y-6">
      {/* Hierarchical Metrics Strip */}
      <section className="metrics">
        <StatCard 
          label="Risk Posture"
          value="Low"
          note="38 / 39 checks nominal"
          icon={<Gauge size={18} />}
          tone="safe"
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
          tone="amber"
          trend={{ type: 'up', value: '+18.2%' }}
          onClick={() => onSay('1,284 malicious requests rejected today.')}
        />

        <StatCard 
          label="Secure Endpoints"
          value="24 / 25"
          note={isServerIsolated ? "1 quarantined host" : "1 needs patch"}
          icon={<Laptop size={18} />}
          tone="blue"
          onClick={() => onNavigate('Assets')}
        />
      </section>

      {/* Row 1: Dominant 70% Network Hero Chart + System Posture */}
      <section className="dashboard-grid top-grid">
        <NetworkTraffic 
          period={period}
          setPeriod={setPeriod}
          onSay={onSay}
        />
        <SystemPosture onSay={onSay} />
      </section>

      {/* Row 2: Global Threat Map & Priority Alert Feed */}
      <section className="dashboard-grid globe-grid">
        <ThreatRadarMap 
          onSay={onSay}
          onNavigate={onNavigate}
        />
        <AlertPanel 
          alerts={alerts}
          allAlerts={allAlerts}
          filter={filter}
          setFilter={setFilter}
          onSelectAlert={onSelectAlert}
          onSimulate={onSimulate}
        />
      </section>

      {/* Row 3: Interactive Network Topology */}
      <section className="dashboard-grid topology-grid">
        <NetworkTopology 
          onSay={onSay}
          isolatedState={isServerIsolated}
          setIsolatedState={setIsServerIsolated}
        />

        {/* Brute Force Quick Widget */}
        <article className="panel flex flex-col justify-between">
          <header className="panel-heading">
            <div>
              <h2>Brute Force Velocity</h2>
              <p>Credential stuffing mitigation rate</p>
            </div>
            <button className="quiet-link" onClick={() => onNavigate('Brute Force')}>
              Full log <ArrowRight size={13} />
            </button>
          </header>

          <div className="p-4 rounded-xl bg-slate-50 border border-ink-border my-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-ink-secondary">Current Ingress Velocity</span>
              <span className="font-mono font-bold text-signal-coral">3.8 reqs/sec</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-signal-coral rounded-full w-3/4" />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-ink-border">
              <span className="text-ink-secondary">Top Targeted Service</span>
              <span className="font-mono font-semibold text-ink-primary">SSH Port 22 (74%)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-ink-border">
              <span className="text-ink-secondary">Primary Vector Origin</span>
              <span className="font-mono font-semibold text-ink-primary">China / Russia (58%)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-ink-secondary">Failed Attempt Mitigation</span>
              <span className="font-mono font-semibold text-signal-emerald">100% Blocked</span>
            </div>
          </div>

          <button 
            className="secondary-btn text-xs w-full mt-4 justify-center"
            onClick={() => onNavigate('Brute Force')}
          >
            Open Brute Force Monitor <ArrowRight size={13} />
          </button>
        </article>
      </section>
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
