import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PersonalInfo } from '../types';

interface FooterProps {
  onOpenResume: () => void;
  onOpenShortcuts: () => void;
  personalInfo?: PersonalInfo;
}

export default function Footer({ onOpenResume, onOpenShortcuts, personalInfo = PERSONAL_INFO }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0D0D0D]/90 py-6 px-4 sm:px-8 font-mono text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} {personalInfo.name}</span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1.5 text-gray-300">
            System: <span className="text-[#00FF41] font-medium">{personalInfo.status}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF41] shadow-[0_0_6px_#00FF41]" />
          </span>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-6 text-xs">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00FF41] transition-colors"
          >
            GitHub
          </a>
          <a
            href={personalInfo.linkedin}
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
