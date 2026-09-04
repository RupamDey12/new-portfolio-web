import { Project } from '../types';

export interface RawGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  default_branch: string;
  homepage: string | null;
  topics?: string[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Python: '#3572A5',
  'C++': '#ff5c8d',
  C: '#555555',
  Rust: '#dea584',
  Go: '#00ADD8',
};

const REPO_DESCRIPTIONS: Record<string, { desc: string; subtitle: string; badge: string }> = {
  chatting: {
    desc: 'Modern conversational AI assistant built with Next.js 15, Assistant UI, AI SDK (Google & OpenAI), Radix UI primitives, Shiki syntax highlighting, and Tailwind CSS v4.',
    subtitle: '// AI-Powered Chat Assistant & UI Starter',
    badge: 'AI / NEXT.JS',
  },
  'Student-record-management-system-': {
    desc: 'Robust object-oriented CLI system in Python for academic record management featuring JSON persistence, deep ID search, input validation, and graceful interrupt handling.',
    subtitle: '// Object-Oriented Academic Record CLI',
    badge: 'PYTHON / CLI',
  },
  'portfolio-web': {
    desc: 'Interactive software engineering portfolio featuring live algorithm visualizer, HTML5 Canvas reactive node physics, cyber audio cues, and integrated Unix terminal.',
    subtitle: '// Cyber-Themed Interactive Portfolio',
    badge: 'CYBER WEB',
  },
};

export function transformGitHubRepo(repo: RawGitHubRepo): Project {
  const customMeta: { desc?: string; subtitle?: string; badge?: string } = REPO_DESCRIPTIONS[repo.name] || {};
  const language = repo.language || 'TypeScript';
  const languageColor = LANGUAGE_COLORS[language] || '#00F3FF';

  let category: Project['category'] = 'GITHUB';
  if (repo.name === 'chatting') category = 'AI_ML';
  else if (repo.name.toLowerCase().includes('student')) category = 'SYSTEMS';
  else if (language === 'JavaScript' || language === 'HTML' || language === 'CSS') category = 'WEB';

  return {
    id: `gh-${repo.id}`,
    title: repo.name,
    badge: customMeta.badge || (repo.language ? repo.language.toUpperCase() : 'REPO'),
    version: repo.default_branch,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    iconType: 'github',
    subtitle: customMeta.subtitle || (repo.description ? `// ${repo.description}` : `// ${language} Repository`),
    description:
      customMeta.desc ||
      repo.description ||
      `Official public repository for ${repo.name} maintained by @RupamDey12 on GitHub.`,
    language,
    languageColor,
    category,
    githubUrl: repo.html_url,
    defaultBranch: repo.default_branch,
    updatedAt: repo.updated_at,
    isLiveGithub: true,
    primaryAction: {
      label: 'inspect',
      type: 'repo',
    },
  };
}

// Fallback pre-fetched cache in case of GitHub rate limiting (60 req/hr unauthenticated)
export const GITHUB_FALLBACK_REPOS: Project[] = [
  {
    id: 'gh-1056959859',
    title: 'chatting',
    badge: 'AI / NEXT.JS',
    version: 'main',
    stars: 0,
    forks: 0,
    iconType: 'github',
    subtitle: '// AI-Powered Chat Assistant & UI Starter',
    description:
      'Modern conversational AI assistant built with Next.js 15, Assistant UI, AI SDK (Google & OpenAI), Radix UI primitives, Shiki syntax highlighting, and Tailwind CSS v4.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    category: 'AI_ML',
    githubUrl: 'https://github.com/RupamDey12/chatting',
    defaultBranch: 'main',
    updatedAt: '2025-09-15T05:06:53Z',
    isLiveGithub: true,
    primaryAction: {
      label: 'inspect',
      type: 'repo',
    },
  },
  {
    id: 'gh-student-records',
    title: 'Student-record-management-system-',
    badge: 'PYTHON / CLI',
    version: 'main',
    stars: 0,
    forks: 0,
    iconType: 'github',
    subtitle: '// Object-Oriented Academic Record CLI',
    description:
      'Robust object-oriented CLI system in Python for academic record management featuring JSON persistence, deep ID search, input validation, and graceful interrupt handling.',
    language: 'Python',
    languageColor: '#3572A5',
    category: 'SYSTEMS',
    githubUrl: 'https://github.com/RupamDey12/Student-record-management-system-',
    defaultBranch: 'main',
    updatedAt: '2026-08-13T06:43:19Z',
    isLiveGithub: true,
    primaryAction: {
      label: 'inspect',
      type: 'repo',
    },
  },
  {
    id: 'gh-portfolio-web',
    title: 'portfolio-web',
    badge: 'CYBER WEB',
    version: 'main',
    stars: 0,
    forks: 0,
    iconType: 'github',
    subtitle: '// Cyber-Themed Interactive Portfolio',
    description:
      'Interactive software engineering portfolio featuring live algorithm visualizer, HTML5 Canvas reactive node physics, cyber audio cues, and integrated Unix terminal.',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    category: 'WEB',
    githubUrl: 'https://github.com/RupamDey12/portfolio-web',
    defaultBranch: 'main',
    updatedAt: '2026-08-16T08:37:24Z',
    isLiveGithub: true,
    primaryAction: {
      label: 'inspect',
      type: 'repo',
    },
  },
];

export async function fetchGitHubRepos(username: string = 'RupamDey12'): Promise<Project[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!res.ok) {
      console.warn(`GitHub API returned status ${res.status}. Utilizing cached fallback.`);
      return GITHUB_FALLBACK_REPOS;
    }
    const data: RawGitHubRepo[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return GITHUB_FALLBACK_REPOS;
    }
    return data.map(transformGitHubRepo);
  } catch (err) {
    console.warn('Failed to fetch from GitHub API directly, using preloaded cluster data', err);
    return GITHUB_FALLBACK_REPOS;
  }
}

export interface GitHubMetrics {
  username: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalContributions: number;
  currentYearContributions: number;
  updatedAt: string;
  isLive: boolean;
  isLoading: boolean;
}

export const FALLBACK_METRICS: GitHubMetrics = {
  username: 'RupamDey12',
  followers: 0,
  following: 0,
  publicRepos: 4,
  totalContributions: 20,
  currentYearContributions: 17,
  updatedAt: new Date().toISOString(),
  isLive: false,
  isLoading: false,
};

export async function fetchGitHubMetrics(username: string = 'RupamDey12'): Promise<GitHubMetrics> {
  const cacheKey = `gh_metrics_${username}`;
  let cachedData: GitHubMetrics | null = null;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      cachedData = JSON.parse(raw);
    }
  } catch {
    // Ignore localStorage parse errors
  }

  let followers = cachedData?.followers ?? FALLBACK_METRICS.followers;
  let following = cachedData?.following ?? FALLBACK_METRICS.following;
  let publicRepos = cachedData?.publicRepos ?? FALLBACK_METRICS.publicRepos;
  let totalContributions = cachedData?.totalContributions ?? FALLBACK_METRICS.totalContributions;
  let currentYearContributions = cachedData?.currentYearContributions ?? FALLBACK_METRICS.currentYearContributions;
  let isLive = false;

  try {
    // 1. Fetch user stats from GitHub REST API
    const userPromise = fetch(`https://api.github.com/users/${username}`)
      .then(async (res) => {
        if (res.ok) {
          const u = await res.json();
          followers = typeof u.followers === 'number' ? u.followers : followers;
          following = typeof u.following === 'number' ? u.following : following;
          publicRepos = typeof u.public_repos === 'number' ? u.public_repos : publicRepos;
          isLive = true;
        }
      })
      .catch((err) => {
        console.warn('GitHub user API fetch error:', err);
      });

    // 2. Fetch public contribution matrix
    const contribPromise = fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then(async (res) => {
        if (res.ok) {
          const c = await res.json();
          if (c && c.total) {
            const totalObj = c.total as Record<string, number | string>;
            const sum: number = Object.values(totalObj).reduce<number>((acc, val) => acc + Number(val || 0), 0);
            if (sum > 0) {
              totalContributions = sum;
              const curYear = new Date().getFullYear().toString();
              currentYearContributions = Number(totalObj[curYear] ?? totalObj['2026'] ?? sum);
              isLive = true;
            }
          }
        }
      })
      .catch((err) => {
        console.warn('GitHub contributions API fetch error:', err);
      });

    await Promise.allSettled([userPromise, contribPromise]);

    const result: GitHubMetrics = {
      username,
      followers,
      following,
      publicRepos,
      totalContributions,
      currentYearContributions,
      updatedAt: new Date().toISOString(),
      isLive,
      isLoading: false,
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch {
      // Ignore quota errors
    }

    return result;
  } catch (e) {
    console.warn('Error fetching GitHub metrics:', e);
    return cachedData || FALLBACK_METRICS;
  }
}

