import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Shield, Calendar, ArrowRight, RefreshCw } from 'lucide-react';

export default function ReportsView({ onSay }) {
  const [generating, setGenerating] = useState(false);

  const reports = [
    {
      title: 'Daily Defense Operations Brief',
      period: 'Today (Past 24 Hours)',
      pages: '4 pages',
      summary: 'Executive summary of 1,284 blocked vectors, top ASNs, and endpoint containment actions.',
      type: 'Executive PDF'
    },
    {
      title: 'Weekly Incident Response Digest',
      period: 'Past 7 Days (Sep 12 - Sep 19)',
      pages: '12 pages',
      summary: 'Full root-cause forensic timeline for 7 mitigated critical/high priority findings.',
      type: 'Technical SOC'
    },
    {
      title: 'SOC 2 & ISO-27001 Posture Audit',
      period: 'Current Quarter Snapshot',
      pages: '8 pages',
      summary: 'Subsystem compliance checklist verification across all 25 managed corporate nodes.',
      type: 'Compliance'
    },
    {
      title: 'Edge Gateway Flow PCAP Dump',
      period: 'Continuous Ring Buffer',
      pages: '28.4 MB CSV',
      summary: 'Raw packet header telemetry log containing 248,000 anonymized connection records.',
      type: 'Raw Data'
    }
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      onSay?.('Daily Defense Operations Brief (PDF) generated and ready for distribution.');
    }, 850);
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <header className="panel-heading">
          <div>
            <h2>Security Intelligence Reports</h2>
            <p>Exportable operational briefs and compliance records built from live telemetry</p>
          </div>
          <button 
            className="primary-btn text-xs"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            {generating ? 'Compiling PDF...' : 'Generate Shift Brief'}
          </button>
        </header>

        <div className="space-y-3 mt-4">
          {reports.map((rep, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl border border-ink-border bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-signal-blue flex-shrink-0 shadow-sm mt-0.5">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <b className="text-sm font-semibold text-ink-primary group-hover:text-signal-blue transition-colors">
                      {rep.title}
                    </b>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 text-ink-secondary">
                      {rep.type}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary mt-1 max-w-xl">
                    {rep.summary}
                  </p>
                  <span className="text-[11px] font-mono text-ink-muted mt-1 block">
                    {rep.period} · {rep.pages}
                  </span>
                </div>
              </div>

              <button 
                className="secondary-btn text-xs flex-shrink-0"
                onClick={() => onSay?.(`Exported ${rep.title} to local downloads.`)}
              >
                <Download size={13} /> Export File
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
