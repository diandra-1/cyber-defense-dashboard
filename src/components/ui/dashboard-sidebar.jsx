import React, { useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut, 
  Hash, 
  ChevronDown, 
  ChevronRight, 
  Inbox, 
  Calendar, 
  Activity, 
  CreditCard, 
  Globe, 
  Terminal, 
  Blocks, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Command, 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Laptop, 
  FileSearch, 
  Download, 
  Network, 
  Server 
} from 'lucide-react';
import { audioEngine } from '../../lib/audioEngine';

export const defaultSentinelNavGroups = [
  {
    items: [
      { id: 'search', title: 'Quick Action', icon: Search, shortcut: '⌘K' },
      { id: 'Overview', title: 'Defense Operations', icon: LayoutDashboard },
      { id: 'Network', title: 'Gateway Telemetry', icon: Network },
    ]
  },
  {
    heading: 'Threat Response',
    items: [
      { id: 'Threats', title: 'Incident Triage', icon: ShieldAlert, badge: 2 },
      { id: 'Brute Force', title: 'Brute Force Stream', icon: Terminal },
    ]
  },
  {
    heading: 'Containment Fleet',
    items: [
      { 
        id: 'Assets', 
        title: 'Zero-Trust Endpoints', 
        icon: Laptop,
        children: [
          { id: 'assets-servers', title: 'Servers (1 Action)', icon: Server },
          { id: 'assets-workstations', title: 'Workstations (Safe)', icon: Laptop },
        ]
      },
      { id: 'Malware detection', title: 'Malware Sandbox', icon: FileSearch },
    ]
  },
  {
    heading: 'Compliance & Audit',
    items: [
      { id: 'Reports', title: 'Shift Briefs (PDF)', icon: Download },
    ]
  }
];

export const defaultSentinelBottomItems = [
  { id: 'Profile', title: 'Analyst Profile', icon: ShieldCheck },
  { id: 'Settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

export function WorkspaceSwitcher({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState('Sentinel HQ');
  
  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  return (
    <div className="relative">
      <div 
        onClick={() => {
          audioEngine.tick(0.04);
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-between px-2.5 py-2 mb-3 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors select-none group border border-transparent hover:border-white/[0.06]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center font-bold text-xs shadow-sm font-mono">
            {current.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-semibold leading-none mb-1 text-slate-100 truncate max-w-[125px] font-display">{current}</span>
            <span className="text-[10px] text-slate-400 leading-none font-mono">Core SOC • Active</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0" strokeWidth={1.5} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-[#0D1117] border border-white/[0.1] rounded-lg shadow-2xl z-50 py-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
            {['Sentinel HQ (Core SOC)', 'Edge Perimeter PoPs', 'Forensic Sandbox Lab'].map(ws => (
              <div 
                key={ws}
                onClick={() => { 
                  audioEngine.tick(0.05);
                  handleSelect(ws); 
                  setIsOpen(false); 
                }}
                className={`px-3 py-2 mx-1 text-[12px] rounded-md cursor-pointer transition-colors ${current === ws ? 'bg-sky-500/15 text-sky-300 font-medium' : 'text-slate-300 hover:bg-white/[0.06]'}`}
              >
                {ws}
              </div>
            ))}
            <div className="h-px bg-white/[0.08] my-1 mx-2" />
            <div 
              onClick={() => {
                audioEngine.tick(0.04);
                setIsOpen(false);
              }}
              className="px-3 py-2 mx-1 text-[12px] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 rounded-md cursor-pointer flex items-center gap-2 transition-colors font-mono"
            >
              <span className="text-[14px] leading-none mb-0.5">+</span> Connect SOC Cluster
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function NavItem({ 
  item, 
  activeId, 
  onSelect,
  level = 0
}) {
  const isActive = activeId === item.id;
  const hasChildren = !!(item.children && item.children.length > 0);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    audioEngine.tick(0.04);
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
    }
  };

  const IconComponent = item.icon;

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`group flex items-center justify-between px-2.5 py-[7px] rounded-lg cursor-pointer transition-all duration-150 select-none
          ${isActive 
            ? 'bg-white/[0.09] text-white font-semibold shadow-xs border border-white/[0.12]' 
            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {IconComponent && (
            <IconComponent 
              className={`w-[15px] h-[15px] transition-colors flex-shrink-0
                ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}
              `} 
              strokeWidth={1.6} 
            />
          )}
          <span className="text-[12.5px] tracking-tight truncate font-sans">
            {item.title}
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.shortcut && (
             <kbd className="hidden group-hover:inline-flex items-center justify-center h-4.5 px-1.5 text-[9px] font-mono text-slate-400 bg-white/[0.06] border border-white/[0.08] rounded shadow-xs">
               {item.shortcut}
             </kbd>
          )}
          {item.badge !== undefined && (
            <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1.5 text-[9.5px] font-bold rounded-full bg-red-500/15 text-red-400 border border-red-500/25 font-mono">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight 
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {hasChildren && (
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div 
              className="absolute top-0 bottom-0 border-l border-white/[0.08]"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children.map(child => (
              <NavItem 
                key={child.id} 
                item={child} 
                activeId={activeId} 
                onSelect={onSelect} 
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({ 
  className = '',
  activeId,
  onSelect,
  activeWorkspace,
  onWorkspaceSelect,
  navGroups = defaultSentinelNavGroups,
  bottomItems = defaultSentinelBottomItems
}) {
  const [internalId, setInternalId] = useState('Overview');
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;

  return (
    <div className={`flex flex-col w-[260px] h-full bg-[#0A0D13] border-r border-white/[0.08] p-3 font-sans ${className}`}>
      <WorkspaceSwitcher selected={activeWorkspace} onSelect={onWorkspaceSelect} />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-3.5 mt-1">
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="px-2.5 mb-1 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                {group.heading}
              </span>
            )}
            {group.items.map(item => (
              <NavItem 
                key={item.id} 
                item={item} 
                activeId={currentId} 
                onSelect={handleSelect} 
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-white/[0.08] flex flex-col gap-0.5">
        {bottomItems.map(item => (
          <NavItem 
            key={item.id} 
            item={item} 
            activeId={currentId} 
            onSelect={handleSelect} 
          />
        ))}
      </div>
    </div>
  );
}

export default SidebarNav;
