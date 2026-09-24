import React, { useState } from 'react';
import { Search, Bell, X, ArrowRight, ShieldCheck, ChevronRight, User } from 'lucide-react';

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
  onSay 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const urgentCount = alerts.filter(a => a.severity === 'Critical' || a.severity === 'High').length;

  return (
    <header className="topbar">
      {/* Breadcrumb - Clean & Architectural */}
      <div className="crumb">
        <b>{page}</b>
        <span>/</span>
        <span>Security Workspace</span>
        <div className="hidden sm:flex items-center gap-1.5 ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-ink-secondary">
          <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-signal-emerald animate-pulse-subtle' : 'bg-slate-400'}`} />
          {live ? 'Edge Gateway Active' : 'Sensor Paused'}
        </div>
      </div>

      {/* Top Actions */}
      <div className="top-actions">
        {/* Search & Command Palette Trigger */}
        <div 
          className="search cursor-pointer group"
          onClick={onOpenCommands}
        >
          <Search size={15} className="text-ink-muted group-hover:text-ink-primary transition-colors" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search signals, IPs, rules..."
            className="cursor-pointer"
            onClick={(e) => {
              // If clicked directly without typing, open command palette
              if (!query) onOpenCommands();
            }}
          />
          <kbd 
            onClick={(e) => {
              e.stopPropagation();
              onOpenCommands();
            }}
            className="hover:bg-slate-200 transition-colors"
          >
            ⌘K
          </kbd>
        </div>

        {/* Notifications Popover */}
        <div className="popover-wrap">
          <button 
            className="icon-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications"
          >
            <Bell size={17} />
            {alerts.length > 0 && <i />}
          </button>

          {showNotifications && (
            <div className="notifications">
              <header>
                <div>
                  <b>Signal Activity Feed</b>
                  <small>Live gateway stream updates</small>
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
                  <span>
                    Core edge firewall rules synchronized across all clusters.
                  </span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button 
                  className="quiet-link"
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
          className="avatar" 
          onClick={onOpenProfile}
          title="Analyst Profile"
        >
          {session?.name ? session.name.slice(0, 2).toUpperCase() : 'SA'}
        </button>
      </div>
    </header>
  );
}
