import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Download, Check, Copy } from 'lucide-react';
import AlgorithmVisualizer from './AlgorithmVisualizer';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PersonalInfo } from '../types';
import avatarImg from '../assets/images/rupam_dey_avatar_1788547507320.jpg';

interface HeroSectionProps {
  personalInfo?: PersonalInfo;
  onExecuteProjects: () => void;
  onDownloadResume: () => void;
  onShowToast: (msg: string) => void;
}

export default function HeroSection({
  personalInfo = PERSONAL_INFO,
  onExecuteProjects,
  onDownloadResume,
  onShowToast,
}: HeroSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(personalInfo.avatarUrl);

  // Synchronize avatar whenever personalInfo is updated from GitHub
  useEffect(() => {
    if (personalInfo.avatarUrl) {
      setAvatarSrc(personalInfo.avatarUrl);
    }
  }, [personalInfo.avatarUrl, personalInfo.updatedAt]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    onShowToast('Email copied to clipboard: ' + personalInfo.email);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section className="w-full pt-4 pb-8">
      {/* 2-Column Grid: Left Terminal + Right Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Terminal Card & CTA Buttons */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between">
          {/* Main Terminal Window Card */}
          <div className="bg-[#121414] border border-white/10 p-5 sm:p-6 font-mono relative backdrop-blur-sm">
            {/* Window control dots */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
            </div>

            {/* Avatar & Whoami header */}
            <div className="flex items-center gap-5 mb-5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/20 p-0.5 bg-[#1A1C1C]">
                  <img
                    key={avatarSrc}
                    src={avatarSrc}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      // Fallback cascade: GitHub direct -> Local downloaded -> Generated asset
                      if (avatarSrc === personalInfo.avatarUrl) {
                        setAvatarSrc(`https://github.com/${personalInfo.githubUsername}.png?size=200`);
                      } else if (avatarSrc.includes('github')) {
                        setAvatarSrc(personalInfo.fallbackAvatarUrl);
                      } else if (avatarSrc !== avatarImg) {
                        setAvatarSrc(avatarImg);
                      }
                    }}
                  />
                </div>
                {/* Green online pulse status badge */}
                <div 
                  className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#00FF41] border-2 border-[#121414] glow-green" 
                  title="GitHub Profile Synchronized"
                />
              </div>

              <div>
                <div className="text-xs sm:text-sm text-[#00FF41] font-mono flex items-center gap-1 mb-1">
                  <span>&gt; whoami</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display">
                  {personalInfo.name}
                </h1>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 font-mono">
              {personalInfo.bio}
            </p>

            {/* Contact Email Pill */}
            <div className="pt-2">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#1A1C1C] border border-white/10 hover:border-[#00FF41]/40 text-xs sm:text-sm text-gray-300 hover:text-white transition-all group"
                title="Click to copy email"
              >
                <Mail className="w-3.5 h-3.5 text-[#00FF41] group-hover:scale-110 transition-transform" />
                <span className="underline decoration-dotted decoration-gray-500 underline-offset-4">
                  {personalInfo.email}
                </span>
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-[#00FF41] ml-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#00FF41] transition-colors ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons underneath */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              onClick={onExecuteProjects}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00FF41] hover:bg-[#72ff70] text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,255,65,0.25)] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            >
              <span>&gt; EXECUTE: PROJECTS</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onDownloadResume}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-[#00F3FF]/10 text-white font-mono text-xs tracking-wider uppercase border border-[#00F3FF] transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.25)] group"
            >
              <Download className="w-3.5 h-3.5 text-[#00F3FF] group-hover:-translate-y-0.5 transition-transform" />
              <span>&gt; DOWNLOAD: RESUME</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Algorithm Visualizer Card */}
        <div className="lg:col-span-6 xl:col-span-5 flex">
          <AlgorithmVisualizer />
        </div>
      </div>
    </section>
  );
}
