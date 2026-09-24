import React from 'react';
import { AlertCircle, ChevronRight, Plus, ShieldCheck } from 'lucide-react';

export default function AlertPanel({ 
  alerts = [], 
  allAlerts = [], 
  filter = 'All', 
  setFilter, 
  onSelectAlert, 
  onSimulate 
}) {
  const severities = ['All', 'Critical', 'High', 'Medium'];

  return (
    <article className="panel alert-panel">
      <header className="panel-heading">
        <div>
          <h2>Priority Threat Signals</h2>
          <p>Active telemetry events awaiting triage and response</p>
        </div>
        <button 
          className="quiet-link"
          onClick={onSimulate}
        >
          Add signal <Plus size={13} />
        </button>
      </header>

      {/* Severity Filter Pills */}
      <div className="filters">
        {severities.map(sev => {
          const count = sev === 'All' 
            ? allAlerts.length 
            : allAlerts.filter(a => a.severity.toLowerCase() === sev.toLowerCase()).length;
          return (
            <button
              key={sev}
              className={filter === sev ? 'selected' : ''}
              onClick={() => setFilter(sev)}
            >
              {sev}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Alert Feed */}
      <div className="alert-list">
        {alerts.length > 0 ? (
          alerts.slice(0, 5).map(alert => (
            <button
              key={alert.id}
              className="alert group"
              onClick={() => onSelectAlert(alert)}
            >
              <div className={`severity-icon ${alert.severity.toLowerCase()}`}>
                <AlertCircle size={15} />
              </div>
              
              <div className="alert-copy">
                <b>{alert.title}</b>
                <small>{alert.source} · {alert.country}</small>
              </div>

              <span className={`severity ${alert.severity.toLowerCase()}`}>
                {alert.severity}
              </span>

              <time>{alert.time}</time>
              <ChevronRight size={15} className="text-ink-muted group-hover:text-ink-primary transition-colors ml-1" />
            </button>
          ))
        ) : (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl">
            <ShieldCheck size={28} className="mx-auto text-signal-emerald mb-2" />
            <b className="text-sm font-semibold text-ink-primary block">No active alerts match this filter</b>
            <p className="text-xs text-ink-muted mt-1">Try another severity or inject a test signal.</p>
            <button 
              className="secondary-btn text-xs mx-auto mt-3"
              onClick={onSimulate}
            >
              Simulate Test Event
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
