import React, { useState, useEffect } from 'react';
import { 
  Command, 
  Terminal, 
  FileText, 
  Mail, 
  Cpu, 
  FolderGit2, 
  Sparkles, 
  X,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenBenchmarks: () => void;
  onToggleShader: () => void;
  onCopyEmail: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenTerminal,
  onOpenResume,
  onOpenBenchmarks,
  onToggleShader,
  onCopyEmail,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          setSearch('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'projects',
      label: 'Navigate: Projects & Repositories',
      shortcut: 'G P',
      icon: FolderGit2,
      run: () => {
        onNavigate('projects');
        onClose();
      },
    },
    {
      id: 'experience',
      label: 'Navigate: Experience & Education',
      shortcut: 'G E',
      icon: FileText,
      run: () => {
        onNavigate('experience');
        onClose();
      },
    },
    {
      id: 'stack',
      label: 'Navigate: Skills & Technical Stack',
      shortcut: 'G S',
      icon: Cpu,
      run: () => {
        onNavigate('stack');
        onClose();
      },
    },
    {
      id: 'terminal',
      label: 'Launch Interactive Shell (Terminal)',
      shortcut: 'T',
      icon: Terminal,
      run: () => {
        onClose();
        onOpenTerminal();
      },
    },
    {
      id: 'benchmarks',
      label: 'Run System & Model Benchmarks',
      shortcut: 'B',
      icon: Cpu,
      run: () => {
        onClose();
        onOpenBenchmarks();
      },
    },
    {
      id: 'resume',
      label: 'View Curriculum Vitae / Resume',
      shortcut: 'R',
      icon: FileText,
      run: () => {
        onClose();
        onOpenResume();
      },
    },
    {
      id: 'email',
      label: 'Copy Contact Email to Clipboard',
      shortcut: 'C',
      icon: Mail,
      run: () => {
        onClose();
        onCopyEmail();
      },
    },
    {
      id: 'shader',
      label: 'Toggle WebGL Matrix Background',
      shortcut: 'M',
      icon: Sparkles,
      run: () => {
        onToggleShader();
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl bg-[#121414] border border-[#00FF41]/40 shadow-[0_0_30px_rgba(0,255,65,0.2)] font-mono overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#1A1C1C]">
          <Command className="w-4 h-4 text-[#00FF41] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search action..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.run}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-left text-gray-300 hover:text-white hover:bg-[#1A1C1C] hover:border-l-2 hover:border-[#00FF41] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#00F3FF] group-hover:text-[#00FF41] transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 bg-[#0d0e0f] px-1.5 py-0.5 border border-white/5">
                      {item.shortcut}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-[#00FF41] transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2 bg-[#0d0e0f] border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
          <span>Use ESC to cancel</span>
          <span>Obsidian Protocol v2.4</span>
        </div>
      </div>
    </div>
  );
}
