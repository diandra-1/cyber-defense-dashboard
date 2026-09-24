import React from 'react';
import { AlertCircle, X, Shield, Lock, CheckCircle2, Globe, Clock, ArrowRight } from 'lucide-react';

export default function IncidentModal({ alert, onClose, onBlock, onResolve }) {
  if (!alert) return null;

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div 
        className="incident-modal"
        onMouseDown={e => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-ink-muted hover:text-ink-primary p-1 rounded-md"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="incident-head">
          <div className={`severity-icon ${alert.severity.toLowerCase()} w-9 h-9`}>
            <AlertCircle size={20} />
          </div>
          <div>
            <span className={`severity ${alert.severity.toLowerCase()}`}>
              {alert.severity} Priority
            </span>
            <h2 className="text-lg font-bold text-ink-primary mt-1">
              {alert.title}
            </h2>
          </div>
        </div>

        <div className="incident-source">
          Source IP: <b>{alert.source}</b> · Origin: <b>{alert.country}</b>
        </div>

        <div className="incident-detail">
          <small>DETECTION TELEMETRY SUMMARY</small>
          <p>{alert.detail}</p>
          <div>
            <span>Detected: <b>{alert.time}</b></span>
            <span>Recommended: <b>ACL Block & Isolate</b></span>
          </div>
        </div>

        <footer>
          <button className="secondary-btn text-xs" onClick={onClose}>
            Keep Open
          </button>
          <button className="block-btn text-xs" onClick={() => onBlock(alert)}>
            <Lock size={13} className="inline mr-1" />
            Block Source IP
          </button>
          <button className="primary-btn text-xs" onClick={() => onResolve(alert.id)}>
            <CheckCircle2 size={13} className="inline mr-1" />
            Resolve Incident
          </button>
        </footer>
      </div>
    </div>
  );
}
