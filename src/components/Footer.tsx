import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenResume: () => void;
  onOpenShortcuts: () => void;
}

export default function Footer({ onOpenResume, onOpenShortcuts }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0D0D0D]/90 py-6 px-4 sm:px-8 font-mono text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} {PERSONAL_INFO.name}</span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1.5 text-gray-300">
            System: <span className="text-[#00FF41] font-medium">{PERSONAL_INFO.status}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF41] shadow-[0_0_6px_#00FF41]" />
          </span>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-6 text-xs">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00FF41] transition-colors"
          >
            GitHub
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00F3FF] transition-colors"
          >
            LinkedIn
          </a>
          <button
            onClick={onOpenResume}
            className="hover:text-[#00FF41] transition-colors cursor-pointer"
          >
            Resume
          </button>
        </div>
      </div>
    </footer>
  );
}
