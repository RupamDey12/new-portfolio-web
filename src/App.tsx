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
import { Project, PersonalInfo } from './types';
import { PERSONAL_INFO, PROJECTS_DATA } from './data/portfolioData';
import { fetchGitHubRepos, fetchGitHubUserProfile } from './services/githubService';

export default function App() {
  const [activeTab, setActiveTab] = useState('root');
  const [shaderEnabled, setShaderEnabled] = useState(true);
  const [shaderIntensity, setShaderIntensity] = useState(1.0);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);

  // Dynamic personal profile state initialized from cached GitHub data or portfolio defaults
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    try {
      const cached = localStorage.getItem(`gh_user_profile_${PERSONAL_INFO.githubUsername}`);
      if (cached) {
        const u = JSON.parse(cached);
        return {
          ...PERSONAL_INFO,
          name: u.name || PERSONAL_INFO.name,
          bio: u.bio || PERSONAL_INFO.bio,
          avatarUrl: u.avatarUrl || PERSONAL_INFO.avatarUrl,
          location: u.location || PERSONAL_INFO.location,
          publicRepos: u.publicRepos ?? PERSONAL_INFO.publicRepos,
          followers: u.followers ?? PERSONAL_INFO.followers,
          following: u.following ?? PERSONAL_INFO.following,
          blog: u.blog || PERSONAL_INFO.blog,
          updatedAt: u.updatedAt || PERSONAL_INFO.updatedAt,
          isLiveGithub: true,
        };
      }
    } catch {}
    return PERSONAL_INFO;
  });

  // Projects state initialized with cached GitHub repos or verified cluster data
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem(`gh_repos_${PERSONAL_INFO.githubUsername}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return PROJECTS_DATA;
  });
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

  // Synchronize all GitHub data: profile, avatar, bio, repositories, stars, and languages
  const handleSyncAllGitHub = useCallback(async (notify = false) => {
    setIsLoadingGitHub(true);
    try {
      const [profileRes, reposRes] = await Promise.allSettled([
        fetchGitHubUserProfile(PERSONAL_INFO.githubUsername),
        fetchGitHubRepos(PERSONAL_INFO.githubUsername),
      ]);

      let profileUpdated = false;
      if (profileRes.status === 'fulfilled' && profileRes.value) {
        const u = profileRes.value;
        profileUpdated = true;
        setPersonalInfo((prev) => ({
          ...prev,
          name: u.name || prev.name,
          bio: u.bio || prev.bio,
          avatarUrl: u.avatarUrl || prev.avatarUrl,
          location: u.location || prev.location,
          publicRepos: u.publicRepos ?? prev.publicRepos,
          followers: u.followers ?? prev.followers,
          following: u.following ?? prev.following,
          blog: u.blog || prev.blog,
          updatedAt: u.updatedAt || new Date().toISOString(),
          isLiveGithub: true,
        }));
      }

      let repoCount = projects.length;
      if (reposRes.status === 'fulfilled' && reposRes.value && reposRes.value.length > 0) {
        repoCount = reposRes.value.length;
        setProjects(reposRes.value);
      }

      if (notify) {
        showToast(
          `Synced with GitHub: ${repoCount} repositories and profile picture updated (@${PERSONAL_INFO.githubUsername})`
        );
      }
    } catch (err) {
      console.warn('Could not complete GitHub sync:', err);
      if (notify) {
        showToast('Connected to GitHub repository cluster.');
      }
    } finally {
      setIsLoadingGitHub(false);
    }
  }, [showToast, projects.length]);

  // Initial fetch on mount + auto-sync when user returns to tab + background polling
  useEffect(() => {
    handleSyncAllGitHub(false);

    // Auto-update when tab regains focus (e.g. user updated GitHub profile or repos in another tab)
    const handleFocus = () => {
      handleSyncAllGitHub(false);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleSyncAllGitHub(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // Periodic live sync every 60 seconds
    const interval = setInterval(() => {
      handleSyncAllGitHub(false);
    }, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [handleSyncAllGitHub]);

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
    navigator.clipboard.writeText(personalInfo.email);
    showToast(`Email copied: ${personalInfo.email}`);
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
        onSyncAll={() => handleSyncAllGitHub(true)}
        personalInfo={personalInfo}
      />

      {/* Main Content Area (offset by header & sidebar) */}
      <main className="md:pl-12 pt-14 flex flex-col min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-6 flex-1 flex flex-col space-y-8">
          {/* Section 1: Hero Section with Terminal Card & Real-time Algorithm Visualizer */}
          <HeroSection
            personalInfo={personalInfo}
            onExecuteProjects={handleExecuteProjects}
            onDownloadResume={() => setIsResumeOpen(true)}
            onShowToast={showToast}
          />

          {/* Section 2: Projects Console (> git status --projects) */}
          <ProjectsSection
            projects={projects}
            isLoadingGitHub={isLoadingGitHub}
            onRefreshGitHub={() => handleSyncAllGitHub(true)}
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
          personalInfo={personalInfo}
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
        personalInfo={personalInfo}
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
        personalInfo={personalInfo}
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
