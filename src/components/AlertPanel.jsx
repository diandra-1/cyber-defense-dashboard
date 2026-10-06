import React from 'react';
import { AlertCircle, ChevronRight, Plus, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

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
          className="quiet-link text-sky-400 hover:text-sky-300"
          onClick={() => {
            audioEngine.sonarPing(0.08);
            onSimulate?.();
          }}
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
              onClick={() => {
                audioEngine.tick(0.03);
                setFilter(sev);
              }}
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
              onClick={() => {
                audioEngine.tick(0.04);
                onSelectAlert(alert);
              }}
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
              <ChevronRight size={15} className="text-slate-500 group-hover:text-slate-200 transition-colors ml-1" />
            </button>
          ))
        ) : (
          <div className="py-8 text-center border border-dashed border-white/[0.1] bg-white/[0.02] rounded-xl">
            <ShieldCheck size={28} className="mx-auto text-emerald-400 mb-2" />
            <b className="text-sm font-semibold text-slate-200 block">No active alerts match this filter</b>
            <p className="text-xs text-slate-400 mt-1">Try another severity or inject a test signal.</p>
            <button 
              className="secondary-btn text-xs mx-auto mt-3"
              onClick={() => {
                audioEngine.sonarPing(0.08);
                onSimulate?.();
              }}
            >
              Simulate Test Event
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
