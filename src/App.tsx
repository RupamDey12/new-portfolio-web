import React, { useState, useEffect, useCallback } from 'react';
import ShaderBackground from './components/ShaderBackground';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import SkillsSection from './components/SkillsSection';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import TerminalModal from './components/TerminalModal';
import BenchmarkModal from './components/BenchmarkModal';
import ResumeModal from './components/ResumeModal';
import SettingsModal from './components/SettingsModal';
import ToastNotification from './components/ToastNotification';
import { Project } from './types';
import { PERSONAL_INFO, PROJECTS_DATA } from './data/portfolioData';
import { fetchGitHubRepos } from './services/githubService';

export default function App() {
  const [activeTab, setActiveTab] = useState('root');
  const [shaderEnabled, setShaderEnabled] = useState(true);
  const [shaderIntensity, setShaderIntensity] = useState(1.0);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);

  // Projects state initialized with verified local cluster data + dynamic GitHub fetching
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [selectedBenchmarkProject, setSelectedBenchmarkProject] = useState<Project | undefined>();
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  }, []);

  // Sync projects from GitHub API
  const handleSyncGitHub = useCallback(async (notify = true) => {
    setIsLoadingGitHub(true);
    try {
      const fetched = await fetchGitHubRepos(PERSONAL_INFO.githubUsername);
      if (fetched && fetched.length > 0) {
        setProjects(fetched);
        if (notify) {
          showToast(`Synced ${fetched.length} repositories from GitHub (@${PERSONAL_INFO.githubUsername})`);
        }
      }
    } catch (err) {
      console.warn('Could not sync GitHub repos:', err);
      if (notify) {
        showToast('Connected to GitHub repository cluster cache.');
      }
    } finally {
      setIsLoadingGitHub(false);
    }
  }, [showToast]);

  // Initial fetch on mount
  useEffect(() => {
    handleSyncGitHub(false);
  }, [handleSyncGitHub]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'root') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'projects') {
      document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'experience') {
      document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'stack') {
      document.getElementById('stack-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'benchmarks') {
      setIsBenchmarkOpen(true);
    } else if (tab === 'logs') {
      setIsTerminalOpen(true);
    }
  };

  const handleExecuteProjects = () => {
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab('projects');
  };

  const handleOpenBenchmark = (project?: Project) => {
    setSelectedBenchmarkProject(project);
    setIsBenchmarkOpen(true);
  };

  const handleOpenProfile = (project: Project) => {
    showToast(`Opening performance profile for ${project.title}`);
    handleOpenBenchmark(project);
  };

  const handleOpenLoadSimulation = (project: Project) => {
    showToast(`Triggering ETL worker test load on ${project.title}`);
    setIsTerminalOpen(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    showToast(`Email copied: ${PERSONAL_INFO.email}`);
  };

  // Keyboard shortcut listener (Ctrl+K, T, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (
        !isTerminalOpen &&
        !isCommandPaletteOpen &&
        !isResumeOpen &&
        !isBenchmarkOpen &&
        !isSettingsOpen &&
        e.target instanceof HTMLElement &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA'
      ) {
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          setIsTerminalOpen(true);
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          setIsResumeOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen, isCommandPaletteOpen, isResumeOpen, isBenchmarkOpen, isSettingsOpen]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#e3e2e2] font-mono selection:bg-[#00FF41]/30 selection:text-[#00FF41] relative">
      {/* Dynamic WebGL Matrix Shader Background */}
      <ShaderBackground enabled={shaderEnabled} intensity={shaderIntensity} />

      {/* Optional CRT Scanlines Layer */}
      {scanlinesEnabled && (
        <div className="scanlines fixed inset-0 pointer-events-none z-20 opacity-30 mix-blend-overlay" />
      )}

      {/* Top Navbar and Left Dock */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsSettingsOpen(true)}
        onShowToast={showToast}
      />

      {/* Main Content Area (offset by header & sidebar) */}
      <main className="md:pl-12 pt-14 flex flex-col min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-6 flex-1 flex flex-col space-y-8">
          {/* Section 1: Hero Section with Terminal Card & Real-time Algorithm Visualizer */}
          <HeroSection
            onExecuteProjects={handleExecuteProjects}
            onDownloadResume={() => setIsResumeOpen(true)}
            onShowToast={showToast}
          />

          {/* Section 2: Projects Console (> git status --projects) */}
          <ProjectsSection
            projects={projects}
            isLoadingGitHub={isLoadingGitHub}
            onRefreshGitHub={() => handleSyncGitHub(true)}
            onOpenBenchmark={handleOpenBenchmark}
            onOpenProfile={handleOpenProfile}
            onOpenLoadSimulation={handleOpenLoadSimulation}
            onShowToast={showToast}
          />

          {/* Section 3: Experience Log (> cat experience.log) */}
          <ExperienceSection />

          {/* Section 4: Skills Matrix (> cat skills.json) */}
          <SkillsSection />
        </div>

        {/* Footer */}
        <Footer
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenShortcuts={() => setIsSettingsOpen(true)}
        />
      </main>

      {/* Interactive Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleTabChange}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenBenchmarks={() => setIsBenchmarkOpen(true)}
        onToggleShader={() => setShaderEnabled(!shaderEnabled)}
        onCopyEmail={handleCopyEmail}
      />

      {/* Interactive Unix Terminal Shell */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onNavigate={handleTabChange}
        onToggleShader={() => setShaderEnabled(!shaderEnabled)}
        projects={projects}
      />

      {/* Real-time Telemetry & Benchmark Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        project={selectedBenchmarkProject}
      />

      {/* Curriculum Vitae / Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        onShowToast={showToast}
        projects={projects}
      />

      {/* System Preferences / Shader & Shortcuts Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        shaderEnabled={shaderEnabled}
        onToggleShader={() => setShaderEnabled(!shaderEnabled)}
        shaderIntensity={shaderIntensity}
        onChangeIntensity={setShaderIntensity}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
      />

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} />
    </div>
  );
}
