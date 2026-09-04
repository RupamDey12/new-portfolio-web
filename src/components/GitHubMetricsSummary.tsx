import React, { useState, useEffect, useRef } from 'react';
import { 
  GitCommit, 
  Users, 
  FolderGit2, 
  ExternalLink, 
  RefreshCw, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { 
  fetchGitHubMetrics, 
  GitHubMetrics, 
  FALLBACK_METRICS 
} from '../services/githubService';
import { PERSONAL_INFO } from '../data/portfolioData';

interface GitHubMetricsSummaryProps {
  onShowToast?: (message: string) => void;
  className?: string;
}

export default function GitHubMetricsSummary({ onShowToast, className = '' }: GitHubMetricsSummaryProps) {
  const [metrics, setMetrics] = useState<GitHubMetrics>(FALLBACK_METRICS);
  const [loading, setLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const loadMetrics = async (showNotification = false) => {
    setLoading(true);
    try {
      const data = await fetchGitHubMetrics(PERSONAL_INFO.githubUsername);
      setMetrics(data);
      if (showNotification && onShowToast) {
        onShowToast(`Synced GitHub telemetry: ${data.totalContributions} contribs, ${data.followers} followers`);
      }
    } catch {
      // Fallback already in place
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics(false);
  }, []);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  return (
    <div className={`relative font-mono ${className}`} ref={popoverRef} id="github-metrics-header-summary">
      {/* Small Metrics Pill in Header */}
      <button
        id="github-metrics-trigger"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className="flex items-center gap-2 px-2 sm:px-2.5 py-1 text-xs bg-[#1A1C1C] hover:bg-[#222525] border border-white/10 hover:border-[#00FF41]/40 transition-all rounded select-none group"
        title="View GitHub Live Telemetry (@RupamDey12)"
        aria-label="GitHub telemetry summary"
      >
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${metrics.isLive ? 'bg-[#00FF41]' : 'bg-[#00F3FF]'} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${metrics.isLive ? 'bg-[#00FF41]' : 'bg-[#00F3FF]'}`} />
        </span>

        {/* Primary Metric: Total Contributions */}
        <div className="flex items-center gap-1 text-[#00FF41]">
          <GitCommit className="w-3.5 h-3.5 text-[#00FF41] group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-[11px] sm:text-xs">
            {metrics.totalContributions}
          </span>
          <span className="text-[10px] text-gray-400 hidden xs:inline">contribs</span>
        </div>

        <span className="text-gray-600 hidden md:inline">|</span>

        {/* Secondary Metric: Followers */}
        <div className="hidden md:flex items-center gap-1 text-[#00F3FF]">
          <Users className="w-3 h-3 text-[#00F3FF]" />
          <span className="font-bold text-[11px]">
            {metrics.followers}
          </span>
          <span className="text-[10px] text-gray-400">followers</span>
        </div>

        <ChevronDown 
          className={`w-3 h-3 text-gray-500 group-hover:text-white transition-transform duration-200 ${isPopoverOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Expanded Telemetry Popover */}
      {isPopoverOpen && (
        <div 
          id="github-metrics-popover"
          className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0D0D0D] border border-[#00FF41]/30 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 rounded"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#00FF41] font-bold">&gt; GH_TELEMETRY</span>
              <span className="text-[9px] px-1 py-0.2 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">
                {metrics.isLive ? 'LIVE CLUSTER' : 'CACHED'}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                loadMetrics(true);
              }}
              disabled={loading}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#00F3FF] transition-colors p-1"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#00F3FF]' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="bg-[#1A1C1C] p-2 border border-white/5">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5">
                <GitCommit className="w-3 h-3 text-[#00FF41]" />
                <span>Contributions</span>
              </div>
              <div className="text-sm font-bold text-[#00FF41] flex items-baseline gap-1">
                {metrics.totalContributions}
                <span className="text-[9px] text-gray-500 font-normal">({metrics.currentYearContributions} this yr)</span>
              </div>
            </div>

            <div className="bg-[#1A1C1C] p-2 border border-white/5">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5">
                <Users className="w-3 h-3 text-[#00F3FF]" />
                <span>Followers</span>
              </div>
              <div className="text-sm font-bold text-[#00F3FF]">
                {metrics.followers}
                <span className="text-[9px] text-gray-500 font-normal ml-1">({metrics.following} following)</span>
              </div>
            </div>

            <div className="bg-[#1A1C1C] p-2 border border-white/5 col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <FolderGit2 className="w-3 h-3 text-yellow-400" />
                <span>Public Repositories</span>
              </div>
              <div className="text-xs font-bold text-white">
                {metrics.publicRepos} active
              </div>
            </div>
          </div>

          {/* User Handle & Direct Link */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">@{metrics.username}</span>
            <a
              href={`https://github.com/${metrics.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#00F3FF] hover:text-white hover:underline transition-colors text-[10px]"
            >
              <span>github.com/{metrics.username}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
