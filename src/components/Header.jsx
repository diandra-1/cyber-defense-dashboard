import React, { useState, useEffect } from 'react';
import { Search, Bell, X, ArrowRight, ShieldCheck, ChevronRight, User, PanelLeftClose, PanelLeftOpen, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

export default function Header({ 
  page, 
  onNavigate, 
  query, 
  setQuery, 
  alerts = [], 
  onOpenCommands, 
  onOpenProfile, 
  session,
  live,
  onSay,
  sidebarOpen = true,
  onToggleSidebar,
  activeWorkspace = 'Sentinel HQ'
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMuted, setIsMuted] = useState(() => audioEngine.getMuted());
  const urgentCount = alerts.filter(a => a.severity === 'Critical' || a.severity === 'High').length;

  useEffect(() => {
    return audioEngine.subscribe((muted) => setIsMuted(muted));
  }, []);

  const handleToggleMute = () => {
    const next = audioEngine.toggleMute();
    setIsMuted(next);
    if (!next) {
      audioEngine.tick(0.08);
    }
    onSay?.(next ? 'Haptic sound muted.' : 'Haptic sound enabled.');
  };

  return (
    <header className="topbar">
      {/* Brand & Breadcrumb */}
      <div className="crumb flex items-center gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold text-xs shadow-sm">
            <ShieldCheck size={16} />
          </div>
          <b className="text-sm font-display tracking-tight text-white">SENTINEL</b>
        </div>

        <span className="text-slate-600 text-xs">/</span>
        <span className="text-xs font-mono font-medium text-slate-300">{page}</span>

        <div className="hidden lg:flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10.5px] font-mono text-slate-400">
          <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-sky-400 animate-pulse-subtle' : 'bg-slate-500'}`} />
          8 Edge PoPs Active
        </div>
      </div>

      {/* Top Actions */}
      <div className="top-actions">
        {/* Search & Command Palette Trigger */}
        <div 
          className="search cursor-pointer group"
          onClick={() => {
            audioEngine.tick(0.04);
            onOpenCommands();
          }}
        >
          <Search size={15} className="text-ink-muted group-hover:text-ink-primary transition-colors" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search signals, IPs, rules..."
            className="cursor-pointer bg-transparent text-ink-primary outline-none"
            onClick={(e) => {
              if (!query) onOpenCommands();
            }}
          />
          <kbd 
            onClick={(e) => {
              e.stopPropagation();
              onOpenCommands();
            }}
            className="bg-white/[0.06] border border-white/[0.1] text-ink-muted hover:text-white transition-colors"
          >
            ⌘K
          </kbd>
        </div>

        {/* Audio Mute/Unmute Haptic Button */}
        <button
          type="button"
          onClick={handleToggleMute}
          className={`icon-button border border-white/[0.08] ${isMuted ? 'text-slate-500 hover:text-slate-300' : 'text-signal-blue hover:text-sky-300'}`}
          title={isMuted ? "Unmute Haptic Sound" : "Mute Haptic Sound"}
          aria-label={isMuted ? "Unmute Haptic Sound" : "Mute Haptic Sound"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Notifications Popover */}
        <div className="popover-wrap">
          <button 
            className="icon-button border border-white/[0.08]"
            onClick={() => {
              audioEngine.tick(0.04);
              setShowNotifications(!showNotifications);
            }}
            aria-label="Toggle notifications"
          >
            <Bell size={17} />
            {alerts.length > 0 && <i />}
          </button>

          {showNotifications && (
            <div className="notifications bg-[#0D1117] border border-white/[0.1] shadow-2xl">
              <header className="border-b border-white/[0.08]">
                <div>
                  <b className="text-ink-primary">Signal Activity Feed</b>
                  <small className="text-ink-muted">Live gateway stream updates</small>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-ink-muted hover:text-ink-primary"
                >
                  <X size={15} />
                </button>
              </header>

              <div className="space-y-2 mb-3">
                <p>
                  <span className="dot critical" />
                  <span>
                    <b className="font-mono text-ink-primary">{urgentCount} urgent signals</b> pending containment.
                  </span>
                </p>
                <p>
                  <span className="dot safe" />
                  <span className="text-ink-secondary">
                    Core edge firewall rules synchronized across all clusters.
                  </span>
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <button 
                  className="quiet-link text-signal-blue"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('Threats');
                  }}
                >
                  Review all incidents <ArrowRight size={12} />
                </button>
                <button
                  className="text-[11px] text-ink-muted hover:text-ink-primary"
                  onClick={() => {
                    setShowNotifications(false);
                    onSay('All notifications marked as read.');
                  }}
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analyst Profile Avatar */}
        <button 
          className="avatar border border-white/[0.1]" 
          onClick={() => {
            audioEngine.tick(0.04);
            onOpenProfile();
          }}
          title="Analyst Profile"
        >
          {session?.name ? session.name.slice(0, 2).toUpperCase() : 'SA'}
        </button>
      </div>
    </header>
  );
}
