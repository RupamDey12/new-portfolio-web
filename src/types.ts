export type ProjectCategory = 'ALL' | 'GITHUB' | 'AI_ML' | 'SYSTEMS' | 'WEB' | 'TYPESCRIPT';

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
