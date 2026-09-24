import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function IncidentBoard({ 
  alerts = [], 
  allAlerts = [], 
  filter = 'All', 
  setFilter, 
  onSelectAlert, 
  onSimulate,
  onSay 
}) {
  const lanes = [
    { id: 'Open', name: 'Open Ingestion', tone: 'open' },
    { id: 'Triage', name: 'Active Triage', tone: 'triage' },
    { id: 'Containment', name: 'Containment', tone: 'contain' },
    { id: 'Resolved', name: 'Resolved / Mitigated', tone: 'resolved' }
  ];

  const [assignments, setAssignments] = useState({});
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    setAssignments(current => {
      const next = { ...current };
      alerts.forEach((alert, index) => {
        if (!next[alert.id]) {
          next[alert.id] = lanes[index % lanes.length].id;
        }
      });
      return next;
    });
  }, [alerts]);

  const handleDrop = (laneId) => {
    if (!draggedId) return;
    setAssignments(prev => ({ ...prev, [draggedId]: laneId }));
    setDraggedId(null);
    onSay?.(`Incident moved to ${laneId} status.`);
  };

  const advanceLane = (alertId, currentLane) => {
    const currentIndex = lanes.findIndex(l => l.id === currentLane);
    const nextLane = lanes[(currentIndex + 1) % lanes.length].id;
    setAssignments(prev => ({ ...prev, [alertId]: nextLane }));
    onSay?.(`Incident advanced to ${nextLane}.`);
  };

  return (
    <div className="space-y-6">
      <div className="board-top">
        <div>
          <span className="text-xs font-mono font-semibold text-signal-coral uppercase tracking-wider block mb-1">
            Incident Response Lifecycle
          </span>
          <h2 className="text-2xl font-bold text-ink-primary">Threat Findings & Triage Board</h2>
          <span>Drag findings across operational lanes or click to inspect telemetry detail.</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="secondary-btn text-xs"
            onClick={() => setFilter('All')}
          >
            All Findings ({allAlerts.length})
          </button>
          <button 
            className="primary-btn text-xs"
            onClick={onSimulate}
          >
            <Plus size={14} /> Inject New Finding
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="board-filters">
        {['All', 'Critical', 'High', 'Medium'].map(f => (
          <button
            key={f}
            className={filter === f ? 'selected' : ''}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Kanban Columns */}
      <div className="kanban-board">
        {lanes.map(lane => {
          const laneAlerts = alerts.filter(a => (assignments[a.id] || 'Open') === lane.id);
          return (
            <div
              key={lane.id}
              className={`kanban-lane ${lane.tone} ${draggedId ? 'drop-ready' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(lane.id)}
            >
              <header>
                <span>
                  <i />
                  {lane.name}
                </span>
                <b>{laneAlerts.length}</b>
              </header>

              {laneAlerts.length === 0 ? (
                <div className="lane-empty">
                  No incidents currently in {lane.name}
                </div>
              ) : (
                laneAlerts.map(alert => (
                  <div
                    key={alert.id}
                    draggable
                    onDragStart={() => setDraggedId(alert.id)}
                    className="finding-card group"
                    onClick={() => onSelectAlert(alert)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <b className="group-hover:text-signal-coral transition-colors">{alert.title}</b>
                      <span className={`severity ${alert.severity.toLowerCase()}`}>
                        {alert.severity}
                      </span>
                    </div>

                    <small>{alert.source} · {alert.country}</small>

                    <footer>
                      <time className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock size={11} /> {alert.time}
                      </time>
                      <button
                        className="p-1 rounded hover:bg-slate-100 text-ink-muted hover:text-ink-primary"
                        title="Advance Lane"
                        onClick={(e) => {
                          e.stopPropagation();
                          advanceLane(alert.id, lane.id);
                        }}
                      >
                        <ArrowRight size={13} />
                      </button>
                    </footer>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
