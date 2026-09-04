import React from 'react';
import { 
  Terminal, 
  FolderGit2, 
  Network, 
  Cpu, 
  HelpCircle, 
  Settings, 
  Command,
  Sliders,
  Sparkles
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import GitHubMetricsSummary from './GitHubMetricsSummary';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenTerminal: () => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onShowToast?: (msg: string) => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
  onOpenTerminal,
  onOpenCommandPalette,
  onOpenSettings,
  onOpenShortcuts,
  onShowToast,
}: NavigationProps) {
  const navItems = [
    { id: 'root', label: 'root' },
    { id: 'projects', label: 'projects' },
    { id: 'experience', label: 'experience' },
    { id: 'stack', label: 'stack' },
    { id: 'benchmarks', label: 'benchmarks' },
    { id: 'logs', label: 'logs' },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/10 z-40 flex items-center justify-between px-4 sm:px-6 font-mono text-sm">
        {/* Left: Terminal Path */}
        <div 
          onClick={() => onTabChange('root')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <span className="text-[#00FF41] font-semibold tracking-tight text-base sm:text-lg group-hover:text-glow-green transition-all">
            {PERSONAL_INFO.handle}
          </span>
          <span className="inline-block w-2 h-4 bg-[#00FF41] animate-pulse" />
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative py-1 text-xs tracking-wider transition-colors duration-150 uppercase ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#84967e] hover:text-[#e3e2e2]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00FF41] glow-green" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: GitHub telemetry summary & Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dynamic GitHub metrics summary */}
          <GitHubMetricsSummary onShowToast={onShowToast} />

          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#84967e] hover:text-white border border-white/10 hover:border-[#00F3FF]/40 bg-[#1A1C1C] transition-all"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-[#00F3FF]" />
            <span className="text-[10px] text-gray-400">Ctrl+K</span>
          </button>

          <button
            onClick={onOpenTerminal}
            className="p-2 text-[#84967e] hover:text-[#00FF41] hover:bg-[#1A1C1C] border border-transparent hover:border-white/10 transition-colors"
            title="Open Interactive Terminal"
            aria-label="Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-[#84967e] hover:text-[#00F3FF] hover:bg-[#1A1C1C] border border-transparent hover:border-white/10 transition-colors"
            title="System Preferences & Shader Controls"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Left Vertical Dock */}
      <aside className="fixed left-0 top-14 bottom-0 w-12 bg-[#0D0D0D]/95 border-r border-white/10 hidden md:flex flex-col items-center justify-between py-4 z-30 font-mono">
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            onClick={onOpenTerminal}
            className="w-10 h-10 flex items-center justify-center text-[#00FF41] hover:bg-[#1A1C1C] border border-transparent hover:border-[#00FF41]/30 transition-all group"
            title="Interactive Terminal"
          >
            <Terminal className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onTabChange('projects')}
            className={`w-10 h-10 flex items-center justify-center transition-all group ${
              activeTab === 'projects'
                ? 'text-[#00F3FF] bg-[#1A1C1C] border-l-2 border-[#00F3FF]'
                : 'text-[#84967e] hover:text-white hover:bg-[#1A1C1C]'
            }`}
            title="Repositories & Projects"
          >
            <FolderGit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onTabChange('experience')}
            className={`w-10 h-10 flex items-center justify-center transition-all group ${
              activeTab === 'experience'
                ? 'text-[#00F3FF] bg-[#1A1C1C] border-l-2 border-[#00F3FF]'
                : 'text-[#84967e] hover:text-white hover:bg-[#1A1C1C]'
            }`}
            title="Experience & Architecture"
          >
            <Network className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onTabChange('benchmarks')}
            className={`w-10 h-10 flex items-center justify-center transition-all group ${
              activeTab === 'benchmarks'
                ? 'text-[#00FF41] bg-[#1A1C1C] border-l-2 border-[#00FF41]'
                : 'text-[#84967e] hover:text-white hover:bg-[#1A1C1C]'
            }`}
            title="System Benchmarks"
          >
            <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Bottom utility */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onOpenShortcuts}
            className="w-10 h-10 flex items-center justify-center text-[#84967e] hover:text-[#00F3FF] hover:bg-[#1A1C1C] transition-colors"
            title="Keyboard Shortcuts & Info"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
