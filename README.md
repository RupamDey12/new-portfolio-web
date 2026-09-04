# Obsidian Protocol Engineering Portfolio

A developer-core, cyber-themed interactive software engineering portfolio for **Rupam Dey** ([@RupamDey12](https://github.com/RupamDey12)).

## Features

- **Live GitHub Metrics Header Summary**: Dynamically pulls real-time contribution counts, follower counts, and public repository statistics from the GitHub API with caching and fallback telemetry.
- **Dynamic Projects Console (`> git status --projects`)**: Live synchronized GitHub repository cards with branch tracking (`main`), direct repository inspection links, and clone commands.
- **Interactive Unix Terminal Shell**: Functional shell with commands (`help`, `whoami`, `projects`, `benchmarks`, `matrix`, `contact`, `clear`).
- **Interactive Algorithm Visualizer**: Real-time pathfinding (A*, Dijkstra, BFS) and sorting visualizations with adjustable step speed and particle physics canvas.
- **Obsidian Protocol & Matrix Shaders**: Customizable WebGL matrix rain shader background, CRT scanlines, sound toggles, and system preferences.

## GitHub Pages Deployment & Blank Screen Fix

### Why the blank white screen occurred
1. When publishing to GitHub Pages with the default setting (`Deploy from a branch -> main / (root)`), GitHub served the **raw unbuilt source files**. The browser received `<script type="module" src="/src/main.tsx">`, which browsers cannot run without compiling, causing a 404 error and a blank white screen.
2. The automatic CI workflow previously failed on `setup-node` because of a lockfile caching constraint.

### How it is fixed
- Fixed `.github/workflows/deploy.yml` so it automatically builds Vite with `npm install --include=dev` and deploys the production bundle.
- Generated and included `package-lock.json`.
- Added pre-built `/docs` directory output as a secondary direct-branch publishing option.
- Configured `base: './'` in `vite.config.ts` so all assets resolve correctly regardless of domain or repo subpath.

### 2-Step Activation on GitHub:
1. In your GitHub repository (e.g. `new-portfolio-web` or `portfolio-web`), navigate to **Settings** > **Pages** on the left menu.
2. Under **Build and deployment** > **Source**:
   - **Recommended Method**: Select **GitHub Actions**. The automated workflow (`deploy.yml`) will build and deploy the compiled site automatically.
   - **Alternative Method**: If you prefer "Deploy from a branch", choose **Branch: main** and set the folder dropdown to **/docs**, then click **Save**.

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
