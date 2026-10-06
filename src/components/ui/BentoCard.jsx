import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { appleSprings } from '../../lib/fluidMotion';

export function BentoCard({
  children,
  className = '',
  spotlightColor = 'rgba(37, 99, 235, 0.18)',
  urgent = false,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, opacity: 0 });

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handlePointerLeave = () => {
    setCoords(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={appleSprings.hoverElevate}
      whileTap={onClick ? appleSprings.tapPress : undefined}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border transition-colors overflow-hidden group",
        "bg-[#0D1117]/85 border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
        urgent && "border-red-500/30 shadow-[0_0_24px_-6px_rgba(220,38,38,0.25)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Border Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(380px circle at ${coords.x}px ${coords.y}px, ${urgent ? 'rgba(220, 38, 38, 0.25)' : spotlightColor}, transparent 75%)`,
          maskImage: 'linear-gradient(black, black)',
          WebkitMaskImage: 'linear-gradient(black, black)',
        }}
      />

      {/* Subtle Inner Ambient Grid Line Accent */}
      <div className="relative z-20 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

export default BentoCard;
