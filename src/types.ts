export type ProjectCategory = 'ALL' | 'GITHUB' | 'AI_ML' | 'SYSTEMS' | 'WEB' | 'TYPESCRIPT';

export interface PersonalInfo {
  handle: string;
  name: string;
  role: string;
  command: string;
  bio: string;
  email: string;
  github: string;
  githubUsername: string;
  avatarUrl: string;
  fallbackAvatarUrl: string;
  linkedin: string;
  status: string;
  location: string;
  publicRepos?: number;
  followers?: number;
  following?: number;
  blog?: string;
  updatedAt?: string;
  isLiveGithub?: boolean;
}

export interface GitHubProfileData {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  blog: string;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
  updatedAt: string;
  isLive: boolean;
}

export interface Project {
  id: string;
  title: string;
  version?: string;
  badge?: string;
  stars: number;
  forks?: number;
  iconType: 'brackets' | 'jetbrains' | 'terminal' | 'github';
  subtitle: string;
  description: string;
  language: string;
  languageColor: string;
  category: ProjectCategory;
  githubUrl: string;
  defaultBranch?: string;
  updatedAt?: string;
  isLiveGithub?: boolean;
  primaryAction: {
    label: string;
    type: 'bench' | 'profile' | 'load' | 'repo';
  };
}

export interface ExperienceItem {
  id: string;
  period: string;
  isAward?: boolean;
  role: string;
  organization: string;
  orgType?: string;
  description: string;
  tags: string[];
}

export interface SkillItem {
  id: string;
  comment: string;
  title: string;
  category: string;
}

export type SortAlgorithm = 'bubble' | 'quick' | 'insertion' | 'selection';

export interface VisualizerState {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  algorithm: SortAlgorithm;
  speed: 1 | 2 | 4;
  isRunning: boolean;
  comparisons: number;
  swaps: number;
}
