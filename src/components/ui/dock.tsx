'use client';

import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import {
  LayoutDashboard,
  ShieldAlert,
  Network,
  Terminal,
  Laptop,
  FileSearch,
  Download,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { audioEngine } from '../../lib/audioEngine';

const DEFAULT_MAGNIFICATION = 58;
const DEFAULT_DISTANCE = 130;
const DEFAULT_PANEL_SIZE = 40;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelSize?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  active?: boolean;
  badge?: number | null;
  onClick?: () => void;
};

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DockContextType = {
  mouseY: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

const DockContext = createContext<DockContextType | undefined>(undefined);

function DockProvider({ children, value }: { children: React.ReactNode; value: DockContextType }) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

export function Dock({
  children,
  className = '',
  spring = { mass: 0.1, stiffness: 200, damping: 14 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
}: DockProps) {
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  return (
    <div className="fixed left-3.5 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center">
      <motion.div
        onMouseMove={({ pageY }) => {
          isHovered.set(1);
          mouseY.set(pageY);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseY.set(Infinity);
        }}
        className={cn(
          'flex flex-col items-center gap-2.5 rounded-2xl p-2',
          'bg-[#0D1117]/90 border border-white/[0.1] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.65)]',
          className
        )}
        role="toolbar"
        aria-label="Sentinel Navigation Dock"
      >
        <DockProvider value={{ mouseY, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </div>
  );
}

export function DockItem({ 
  children, 
  className = '', 
  active = false,
  badge = null,
  onClick,
  ...props 
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseY, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseY, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - (domRect.y + window.scrollY) - domRect.height / 2;
  });

  const sizeTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const size = useSpring(sizeTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => {
        isHovered.set(1);
        audioEngine.tick(0.02);
      }}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center rounded-xl cursor-pointer select-none transition-colors group',
        active 
          ? 'bg-sky-500/20 text-sky-400 border border-sky-400/40 shadow-[0_0_16px_rgba(56,189,248,0.25)]' 
          : 'text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent',
        className
      )}
      tabIndex={0}
      role="button"
      {...props}
    >
      {/* Active Indicator Dot */}
      {active && (
        <span className="absolute -left-1.5 w-1 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_#38BDF8]" />
      )}

      {/* Live Badge */}
      {badge !== null && badge > 0 && (
        <span className="absolute -top-1 -right-1 px-1.5 min-w-[17px] h-4 text-[9px] font-mono font-bold rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border border-red-500/50">
          {badge}
        </span>
      )}

      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement<any>, { size, isHovered })
      )}
    </motion.div>
  );
}

export function DockLabel({ children, className = '', ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['isHovered'] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -6, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute left-full ml-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-50',
            'px-2.5 py-1 rounded-lg text-xs font-semibold text-white whitespace-nowrap',
            'bg-[#0D1117] border border-white/[0.14] shadow-2xl backdrop-blur-md font-sans tracking-wide',
            className
          )}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DockIcon({ children, className = '', ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const size = restProps['size'] as MotionValue<number> | undefined;
  const fallbackSize = useMotionValue(40);
  const targetMotionValue = size || fallbackSize;
  const iconSizeTransform = useTransform(targetMotionValue, (val) => Math.max(16, (val as number) * 0.44));

  return (
    <motion.div
      style={{ width: iconSizeTransform, height: iconSizeTransform }}
      className={cn('flex items-center justify-center pointer-events-none', className)}
    >
      {children}
    </motion.div>
  );
}

export function SentinelVerticalDock({ 
  activePage, 
  onNavigate, 
  urgentCount = 0 
}: { 
  activePage: string; 
  onNavigate: (page: string) => void; 
  urgentCount?: number; 
}) {
  const dockItems = [
    { id: 'Overview', title: 'Defense Cockpit', icon: LayoutDashboard },
    { id: 'Threats', title: 'Incident Triage', icon: ShieldAlert, badge: urgentCount },
    { id: 'Network', title: 'Traffic Telemetry', icon: Network },
    { id: 'Brute Force', title: 'Brute Force Stream', icon: Terminal },
    { id: 'Assets', title: 'Zero-Trust Endpoints', icon: Laptop },
    { id: 'Malware detection', title: 'Malware Sandbox', icon: FileSearch },
    { id: 'Reports', title: 'Shift Briefs (PDF)', icon: Download },
    { id: 'Settings', title: 'Settings', icon: Settings },
  ];

  return (
    <Dock>
      {/* Brand Glyph at Top */}
      <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center text-sky-400 mb-1 shadow-sm">
        <ShieldCheck size={18} />
      </div>

      <div className="w-5 h-[1px] bg-white/[0.08] my-0.5" />

      {dockItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activePage === item.id;
        return (
          <DockItem
            key={item.id}
            active={isActive}
            badge={item.badge}
            onClick={() => {
              audioEngine.tick(0.04);
              onNavigate(item.id);
            }}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>
              <IconComponent className="w-full h-full" strokeWidth={1.8} />
            </DockIcon>
          </DockItem>
        );
      })}
    </Dock>
  );
}

export default SentinelVerticalDock;
