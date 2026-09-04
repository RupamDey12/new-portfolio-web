# Obsidian Protocol Engineering Portfolio

A developer-core, cyber-themed interactive software engineering portfolio for **Rupam Dey** ([@RupamDey12](https://github.com/RupamDey12)).

## Features

- **Live GitHub Metrics Header Summary**: Dynamically pulls real-time contribution counts, follower counts, and public repository statistics from the GitHub API with caching and fallback telemetry.
- **Dynamic Projects Console (`> git status --projects`)**: Live synchronized GitHub repository cards with branch tracking (`main`), direct repository inspection links, and clone commands.
- **Interactive Unix Terminal Shell**: Functional shell with commands (`help`, `whoami`, `projects`, `benchmarks`, `matrix`, `contact`, `clear`).
- **Interactive Algorithm Visualizer**: Real-time pathfinding (A*, Dijkstra, BFS) and sorting visualizations with adjustable step speed and particle physics canvas.
- **Obsidian Protocol & Matrix Shaders**: Customizable WebGL matrix rain shader background, CRT scanlines, sound toggles, and system preferences.

## GitHub Pages Deployment

This repository is optimized for GitHub Pages out of the box:

- **Relative Asset Resolution**: Configured with `base: './'` in `vite.config.ts` so the portfolio runs seamlessly at root domains or nested repository subpaths (`https://<username>.github.io/<repo>/`).
- **Automated CI/CD Workflow**: A production-ready GitHub Actions workflow is included at `.github/workflows/deploy.yml`.
- **SPA Fallback & Jekyll Bypass**: Includes automatic `404.html` fallback generation and `.nojekyll` handling.

### How to Enable GitHub Pages

1. Push this repository to GitHub (e.g., `https://github.com/RupamDey12/portfolio-web`).
2. In your repository on GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow will automatically build and publish your portfolio on every push to `main`.

## Local Development

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Build for production & generate 404.html
npm run build

# Preview production build
npm run preview
```
