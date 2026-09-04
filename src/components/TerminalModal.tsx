import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, Maximize2, Minimize2 } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS_DATA, EXPERIENCE_DATA, SKILLS_DATA } from '../data/portfolioData';
import { Project, PersonalInfo } from '../types';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onToggleShader: () => void;
  projects?: Project[];
  personalInfo?: PersonalInfo;
}

interface CommandLog {
  command: string;
  output: React.ReactNode;
}

export default function TerminalModal({
  isOpen,
  onClose,
  onNavigate,
  onToggleShader,
  projects,
  personalInfo = PERSONAL_INFO,
}: TerminalModalProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      command: 'sys.init --environment=production',
      output: (
        <div className="text-gray-400 space-y-1">
          <p className="text-[#00FF41]">Welcome to {personalInfo.name}&apos;s Interactive Shell [Obsidian OS 2.4]</p>
          <p>Type <span className="text-[#00F3FF] font-bold">help</span> to view all available commands or <span className="text-[#00F3FF] font-bold">exit</span> to close.</p>
        </div>
      ),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response: React.ReactNode = null;

    if (trimmed === '') return;

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    switch (trimmed) {
      case 'help':
        response = (
          <div className="text-gray-300 space-y-1 text-xs">
            <p className="text-[#00FF41] font-bold">AVAILABLE COMMANDS:</p>
            <p><span className="text-[#00F3FF]">whoami</span> - Display author profile and operational parameters</p>
            <p><span className="text-[#00F3FF]">git status --projects</span> or <span className="text-[#00F3FF]">projects</span> - List indexed repositories</p>
            <p><span className="text-[#00F3FF]">cat experience.log</span> or <span className="text-[#00F3FF]">experience</span> - View engineering trajectory</p>
            <p><span className="text-[#00F3FF]">cat skills.json</span> or <span className="text-[#00F3FF]">skills</span> - View technical competencies</p>
            <p><span className="text-[#00F3FF]">bench</span> - Run neural net &amp; system latency benchmarks</p>
            <p><span className="text-[#00F3FF]">matrix</span> - Toggle WebGL background shader</p>
            <p><span className="text-[#00F3FF]">clear</span> - Clear terminal session output</p>
            <p><span className="text-[#00F3FF]">contact</span> - Display direct encrypted communication channels</p>
            <p><span className="text-[#00F3FF]">exit</span> - Close terminal console</p>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="text-gray-300 space-y-1">
            <p className="text-white font-bold">{personalInfo.name}</p>
            <p className="text-gray-400">{personalInfo.bio}</p>
            <p className="text-[#00FF41]">Status: {personalInfo.status}</p>
            <p className="text-[#00F3FF]">Email: {personalInfo.email}</p>
            <p className="text-gray-300">GitHub: <span className="text-[#00F3FF]">{personalInfo.github}</span></p>
          </div>
        );
        break;

      case 'projects':
      case 'git status':
      case 'git status --projects': {
        const activeList = projects && projects.length > 0 ? projects : PROJECTS_DATA;
        response = (
          <div className="space-y-2">
            <p className="text-[#00FF41]">Indexed Repositories ({activeList.length}):</p>
            {activeList.map((p) => (
              <div key={p.id} className="border-l-2 border-[#00F3FF] pl-2 text-xs">
                <span className="text-white font-bold">{p.title}</span>{' '}
                <span className="text-gray-400">{p.subtitle}</span>{' '}
                <span className="text-[#00FF41]">[{p.language}]</span>
                {p.isLiveGithub && (
                  <span className="text-[#00F3FF] text-[10px] ml-1 bg-[#00F3FF]/10 px-1 border border-[#00F3FF]/30">
                    GITHUB
                  </span>
                )}
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'experience':
      case 'cat experience.log':
        response = (
          <div className="space-y-2 text-xs">
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.id} className="border-l-2 border-[#00FF41] pl-2">
                <p className="text-white font-bold">{exp.period} — {exp.role}</p>
                <p className="text-[#00F3FF]">{exp.organization}</p>
                <p className="text-gray-400">{exp.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
      case 'cat skills.json':
        response = (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {SKILLS_DATA.map((s) => (
              <div key={s.id}>
                <span className="text-gray-500">{s.comment}</span>{' '}
                <span className="text-white">{s.title}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'bench':
      case 'benchmarks':
        response = (
          <div className="text-xs space-y-1 text-gray-300">
            <p className="text-[#00FF41] font-bold">[BENCHMARK & TELEMETRY CLUSTER]</p>
            <p>Student Record Query Execution: <span className="text-[#00F3FF]">0.12 ms (O(1) JSON lookup)</span></p>
            <p>Chatting Assistant Streaming TTFT: <span className="text-yellow-400">180 ms (Edge API)</span></p>
            <p>Interactive Web Canvas Refresh: <span className="text-[#00FF41]">60.0 FPS / 16.6ms</span></p>
          </div>
        );
        break;

      case 'matrix':
      case 'shader':
        onToggleShader();
        response = <span className="text-[#00FF41]">WebGL matrix shader toggled.</span>;
        break;

      case 'contact':
        response = (
          <div className="text-xs space-y-1">
            <p className="text-white">Direct Channel: <span className="text-[#00FF41]">{personalInfo.email}</span></p>
            <p className="text-white">GitHub: <span className="text-[#00F3FF]">{personalInfo.github}</span></p>
            <p className="text-white">LinkedIn: <span className="text-[#00F3FF]">{personalInfo.linkedin}</span></p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        response = (
          <span className="text-red-400">
            Command not recognized: &quot;{cmd}&quot;. Type &quot;help&quot; for available operations.
          </span>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output: response }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl h-[480px] bg-[#0D0D0D] border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col font-mono">
        {/* Terminal Title Bar */}
        <div className="h-10 bg-[#1A1C1C] border-b border-white/10 px-4 flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 font-medium text-white flex items-center gap-1">
              <TerminalIcon className="w-3.5 h-3.5 text-[#00FF41]" />
              guest@rupam-dey:~/terminal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:text-white text-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Command Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-[#00FF41]">guest@rupam-dey:~$</span>
                <span className="text-white font-medium">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Prompt Input Line */}
        <div className="p-3 bg-[#121414] border-t border-white/10 flex items-center gap-2 text-xs">
          <span className="text-[#00FF41] font-bold">guest@rupam-dey:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type command (e.g. 'help', 'whoami', 'projects')..."
            className="flex-1 bg-transparent text-white focus:outline-none caret-[#00FF41]"
          />
        </div>
      </div>
    </div>
  );
}
