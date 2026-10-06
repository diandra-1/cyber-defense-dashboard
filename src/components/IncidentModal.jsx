import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AlertCircle, X, Shield, Lock, CheckCircle2, Globe, Clock, ArrowRight } from 'lucide-react';
import { appleSprings } from '../lib/fluidMotion';
import { audioEngine } from '../lib/audioEngine';

export default function IncidentModal({ alert, onClose, onBlock, onResolve }) {
  if (!alert) return null;

  const handleDragEnd = (event, info) => {
    // Velocity handoff: dismiss if dragged down > 80px or flicked down with velocity > 400px/s
    if (info.offset.y > 80 || info.velocity.y > 400) {
      onClose();
    }
  };

  const handleResolveClick = () => {
    audioEngine.successChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38BDF8', '#10B981', '#F8FAFC']
    });
    onResolve(alert.id);
  };

  const handleBlockClick = () => {
    audioEngine.switchClick(0.1);
    onBlock(alert);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="backdrop" 
      onClick={onClose}
    >
      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }} // Rubber-banding resistance
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 40 }}
        transition={appleSprings.sheet}
        className="incident-modal cursor-default select-none"
        onClick={e => e.stopPropagation()}
      >
        {/* iOS Pull-down Sheet Indicator Pill */}
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto -mt-2 mb-3 cursor-grab active:cursor-grabbing hover:bg-slate-400 transition-colors" />

        <button 
          className="absolute top-4 right-4 text-ink-muted hover:text-ink-primary p-1 rounded-md transition-colors"
          onClick={onClose}
          aria-label="Close modal"
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
            <h2 className="text-lg font-bold text-ink-primary mt-1 font-display">
              {alert.title}
            </h2>
          </div>
        </div>

        <div className="incident-source">
          Source IP: <b className="font-mono text-ink-primary">{alert.source}</b> · Origin: <b>{alert.country}</b>
        </div>

        <div className="incident-detail">
          <small>DETECTION TELEMETRY SUMMARY</small>
          <p>{alert.detail}</p>
          <div>
            <span>Detected: <b className="font-mono">{alert.time}</b></span>
            <span>Recommended: <b className="text-signal-coral">ACL Block & Isolate</b></span>
          </div>
        </div>

        <footer>
          <motion.button 
            whileHover={appleSprings.hoverElevate}
            whileTap={appleSprings.tapPress}
            className="secondary-btn text-xs" 
            onClick={onClose}
          >
            Keep Open
          </motion.button>
          <motion.button 
            whileHover={appleSprings.hoverElevate}
            whileTap={appleSprings.tapPress}
            className="block-btn text-xs" 
            onClick={handleBlockClick}
          >
            <Lock size={13} className="inline mr-1" />
            Block Source IP
          </motion.button>
          <motion.button 
            whileHover={appleSprings.hoverElevate}
            whileTap={appleSprings.tapPress}
            className="primary-btn text-xs" 
            onClick={handleResolveClick}
          >
            <CheckCircle2 size={13} className="inline mr-1" />
            Resolve Incident
          </motion.button>
        </footer>
      </motion.div>
    </motion.div>
  );
}
