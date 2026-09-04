import { Project, ExperienceItem, SkillItem } from '../types';

export const PERSONAL_INFO = {
  handle: '~/rupamdey12/portfolio',
  name: 'Rupam Dey',
  role: 'Software Engineer & Systems Specialist',
  command: '> whoami',
  bio: 'Architecting robust systems and elegant interfaces. Building conversational AI agents, student record management systems, and interactive web tools.',
  email: 'rupamdeyrupamdey1@gmail.com',
  github: 'https://github.com/RupamDey12',
  githubUsername: 'RupamDey12',
  avatarUrl: 'https://avatars.githubusercontent.com/u/201964261?v=4',
  fallbackAvatarUrl: '/assets/avatar.jpg',
  linkedin: 'https://linkedin.com/in/rupam-dey',
  status: 'Operational',
  location: 'Global / Remote',
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'gh-chatting',
    title: 'chatting',
    version: 'main',
    badge: 'AI / NEXT.JS 15',
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
    isLiveGithub: true,
    primaryAction: {
      label: 'inspect',
      type: 'repo',
    },
  },
  {
    id: 'gh-student-records',
    title: 'Student-record-management-system-',
    version: 'main',
    badge: 'PYTHON / CLI',
    stars: 0,
    forks: 0,
    iconType: 'github',
    subtitle: '// Object-Oriented Academic Record CLI',
    description:
      'Robust object-oriented CLI system in Python for academic record management featuring JSON persistence, deep ID search, regex input validation, and graceful interrupt handling.',
    language: 'Python',
    languageColor: '#3572A5',
    category: 'SYSTEMS',
    githubUrl: 'https://github.com/RupamDey12/Student-record-management-system-',
    defaultBranch: 'main',
    isLiveGithub: true,
    primaryAction: {
      label: 'inspect',
      type: 'repo',
    },
  },
  {
    id: 'gh-portfolio-web',
    title: 'portfolio-web',
    version: 'main',
    badge: 'CYBER WEB',
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
    isLiveGithub: true,
    primaryAction: {
      label: 'inspect',
      type: 'repo',
    },
  },
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    period: '2024 — PRESENT',
    role: 'Software Engineer & Systems Intern',
    organization: 'Distributed Systems Lab',
    description:
      'Engineered high-concurrency microservices, benchmarked latency bottlenecks across message queues, and improved processing throughput by 32% using optimized C++ and Go workers.',
    tags: ['C++20', 'Docker', 'Linux Kernel', 'gRPC'],
  },
  {
    id: 'exp-2',
    period: '2022 — 2026',
    role: 'B.Tech in Computer Science & Engineering',
    organization: 'University School of Technology',
    description:
      'Core coursework in Advanced Data Structures, Operating Systems, Database Management Systems, Compiler Design, and Distributed Computing. Maintained top 5% academic standing.',
    tags: ['Data Structures', 'Algorithms', 'Computer Networks', 'DBMS'],
  },
  {
    id: 'exp-3',
    period: 'AWARD',
    isAward: true,
    role: '1st Place — National Algorithmic Hackathon',
    organization: 'Team Lead // Architecture',
    description:
      'Architected real-time disaster-response resource routing engine in 36 hours. Implemented custom Dijkstra variant with dynamic traffic penalty coefficients.',
    tags: ['Dijkstra Engine', 'Real-Time Routing', '36h Sprint'],
  },
];

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 's-python',
    comment: '// Python',
    title: 'Data / ML / Backend',
    category: 'AI & Data',
  },
  {
    id: 's-cpp',
    comment: '// C++',
    title: 'Systems / Algorithms',
    category: 'Low Level',
  },
  {
    id: 's-c',
    comment: '// C',
    title: 'Embedded / Low-level',
    category: 'Low Level',
  },
  {
    id: 's-jsts',
    comment: '// JS / TS',
    title: 'Frontend / React',
    category: 'Web',
  },
  {
    id: 's-htmlcss',
    comment: '// HTML / CSS',
    title: 'UI / Tailwind',
    category: 'Design',
  },
  {
    id: 's-db',
    comment: '// DB',
    title: 'SQL / MongoDB',
    category: 'Data Persistence',
  },
  {
    id: 's-tools',
    comment: '// Tools',
    title: 'Git / Docker / Linux',
    category: 'DevOps & Tooling',
  },
  {
    id: 's-domain',
    comment: '// Domain',
    title: 'Data Science',
    category: 'Specialization',
  },
];
