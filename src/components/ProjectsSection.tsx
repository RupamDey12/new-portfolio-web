import React, { useState } from 'react';
import { 
  Star, 
  Copy, 
  Check, 
  Gauge, 
  Activity, 
  Zap, 
  Terminal as TerminalIcon, 
  ExternalLink,
  GitBranch,
  GitFork,
  RefreshCw
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  isLoadingGitHub?: boolean;
  onRefreshGitHub?: () => void;
  onOpenBenchmark: (project?: Project) => void;
  onOpenProfile: (project: Project) => void;
  onOpenLoadSimulation: (project: Project) => void;
  onShowToast: (msg: string) => void;
}

export default function ProjectsSection({
  projects,
  isLoadingGitHub = false,
  onRefreshGitHub,
  onOpenBenchmark,
  onOpenProfile,
  onOpenLoadSimulation,
  onShowToast,
}: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const liveGitHubCount = projects.filter((p) => p.isLiveGithub || p.category === 'GITHUB').length;

  const categories: { key: ProjectCategory; label: string }[] = [
    { key: 'ALL', label: `[ ALL (${projects.length}) ]` },
    { key: 'GITHUB', label: `[ GITHUB (${liveGitHubCount}) ]` },
    { key: 'AI_ML', label: '[ AI & ML ]' },
    { key: 'SYSTEMS', label: '[ SYSTEMS / CLI ]' },
    { key: 'WEB', label: '[ WEB / FULLSTACK ]' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'GITHUB') return p.isLiveGithub || p.category === 'GITHUB';
    return p.category === activeCategory;
  });

  const handleClone = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloneCmd = `git clone ${project.githubUrl}.git`;
    navigator.clipboard.writeText(cloneCmd);
    setCopiedId(project.id);
    onShowToast(`Copied to clipboard: ${cloneCmd}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleActionClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.primaryAction.type === 'bench') {
      onOpenBenchmark(project);
    } else if (project.primaryAction.type === 'profile') {
      onOpenProfile(project);
    } else if (project.primaryAction.type === 'load') {
      onOpenLoadSimulation(project);
    } else if (project.primaryAction.type === 'repo' || project.isLiveGithub) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
      onShowToast(`Navigating to GitHub repository: ${project.title}`);
    }
  };

  return (
    <section id="projects-section" className="w-full py-8 font-mono">
      {/* Section Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-[#00FF41] flex items-center gap-2">
          <span>&gt; git status --projects</span>
        </h2>
      </div>

      {/* Filter Tabs & Sync Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1 text-xs border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                    : 'bg-[#1A1C1C] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* GitHub Cluster Sync status & Refresh button */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41] animate-pulse" />
            <span className="text-gray-300 font-medium tracking-wide hidden sm:inline">
              SYNCED WITH GITHUB CLUSTER
            </span>
            <span className="text-gray-300 font-medium tracking-wide sm:hidden">
              GITHUB SYNCED
            </span>
          </div>

          {onRefreshGitHub && (
            <button
              onClick={onRefreshGitHub}
              disabled={isLoadingGitHub}
              className="p-1.5 bg-[#1A1C1C] border border-white/10 hover:border-[#00FF41]/40 text-gray-400 hover:text-[#00FF41] transition-all cursor-pointer disabled:opacity-50"
              title="Refresh repositories from GitHub API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGitHub ? 'animate-spin text-[#00FF41]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#121414] border border-white/10 hover:border-[#00FF41]/50 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,65,0.12)] group relative"
          >
            {/* Top header row: Title, badges, stars, and icon */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-bold text-white group-hover:text-[#00FF41] transition-colors font-display flex items-center gap-1.5"
                  >
                    <span>{project.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF41]" />
                  </a>

                  {project.version && (
                    <span className="text-[10px] text-[#00FF41] bg-[#00FF41]/10 px-1 py-0.5 border border-[#00FF41]/30">
                      {project.version}
                    </span>
                  )}

                  {project.badge && (
                    <span className="text-[10px] text-[#00F3FF] bg-[#00F3FF]/10 px-1.5 py-0.5 border border-[#00F3FF]/30 tracking-wider">
                      {project.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Star count */}
                  <div className="flex items-center gap-1 text-xs text-gray-300 bg-[#1A1C1C] px-1.5 py-0.5 border border-white/10">
                    <Star className="w-3 h-3 text-[#00F3FF] fill-[#00F3FF]" />
                    <span>{project.stars}</span>
                  </div>

                  {/* Fork count if available */}
                  {project.forks !== undefined && project.forks > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-[#1A1C1C] px-1.5 py-0.5 border border-white/10">
                      <GitFork className="w-3 h-3" />
                      <span>{project.forks}</span>
                    </div>
                  )}

                  {/* Icon type */}
                  <div className="text-gray-400 group-hover:text-[#00FF41] transition-colors">
                    {project.iconType === 'brackets' && (
                      <span className="text-sm font-bold text-[#00FF41]">{`{ }`}</span>
                    )}
                    {project.iconType === 'jetbrains' && (
                      <span className="text-xs font-bold px-1 bg-white/10 text-white">JB</span>
                    )}
                    {project.iconType === 'terminal' && (
                      <TerminalIcon className="w-4 h-4 text-[#00F3FF]" />
                    )}
                    {project.iconType === 'github' && (
                      <GitBranch className="w-4 h-4 text-[#00FF41]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div className="text-xs text-[#84967e] mb-3">
                {project.subtitle}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            {/* Bottom bar: Language + Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: project.languageColor }}
                />
                <span className="text-gray-300 text-xs">{project.language}</span>
                {project.isLiveGithub && (
                  <span className="text-[10px] text-[#00FF41] bg-[#00FF41]/10 px-1 border border-[#00FF41]/30 ml-1">
                    LIVE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Primary Action Button */}
                <button
                  onClick={(e) => handleActionClick(project, e)}
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-[#00F3FF] transition-colors cursor-pointer"
                  title={project.isLiveGithub ? 'Open repository on GitHub' : `Run ${project.primaryAction.label}`}
                >
                  {project.primaryAction.type === 'bench' && (
                    <Gauge className="w-3.5 h-3.5 text-[#00F3FF]" />
                  )}
                  {project.primaryAction.type === 'profile' && (
                    <Activity className="w-3.5 h-3.5 text-[#f1e05a]" />
                  )}
                  {project.primaryAction.type === 'load' && (
                    <Zap className="w-3.5 h-3.5 text-[#00F3FF]" />
                  )}
                  {project.primaryAction.type === 'repo' && (
                    <ExternalLink className="w-3.5 h-3.5 text-[#00FF41]" />
                  )}
                  <span>{project.primaryAction.label}</span>
                </button>

                {/* Clone Command button */}
                <button
                  onClick={(e) => handleClone(project, e)}
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-[#00FF41] transition-colors cursor-pointer"
                  title="Copy git clone command"
                >
                  {copiedId === project.id ? (
                    <Check className="w-3.5 h-3.5 text-[#00FF41]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>clone</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
