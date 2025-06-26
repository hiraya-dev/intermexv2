#  Intermex Custom Webflow Scripts

Modular JavaScript for scalable, production-grade Webflow development.
Built with ES Modules, optimized for use in Webflow custom code areas or via external CDN.

## Features
- Vanilla JS (ES6+) – No jQuery or frameworks.
- GSAP – Animation library, globally available.
- Webflow-optimized – Integrates with existing class and CMS structures.
- Modular – Each feature/animation is isolated for maintainability.
- Configurable – Centralized config objects for easy tuning.
- Production-ready – Bundled with esbuild for CDN or direct embed.

## Folder Structure
```bash
intermexv2/
├── scripts/                  # Modular JS files
│   ├── animations/           # All animation-related modules
│   ├── utils/                # Reusable non-UI helpers (e.g. WhatsApp logic)
│   ├── config/               # GSAP plugin configuration
│   └── main.js               # Entry point – imports and initializes all modules
├── dist/                     # Production-ready bundled output
│   └── bundle.min.js
├── package.json
├── .gitignore
└── README.md
```

## Usage
1. Development
    - Edit or add scripts in scripts/.
    - Use ES6 modules and import/export as needed.

2. Build for Production

```bash
npm install
npm run build
```

    - Bundles scripts with esbuild into /dist for CDN or Webflow embed.

3. Webflow Integration
    - Upload bundled JS from /dist to your preferred CDN (e.g., jsDelivr).
    - Or, paste the code directly into Webflow's custom code areas.
    - Ensure GSAP and SwiperJS are loaded globally if your scripts depend on them.

4. Script Example

```js
// Import and initialize a feature (e.g., Bento Features Animation)
import { initBentoFeaturesAnimation } from './scripts/animations/bento-features.js';

document.addEventListener('DOMContentLoaded', () => {
  initBentoFeaturesAnimation();
});
```

## Scripts Overview
- animations/
    Modular GSAP animation logic for Webflow sections (e.g., bento grid, marquees, navbar themes).
- utils/
    Utility scripts for enhanced integrations (e.g., WhatsApp buttons).
- config/
    Centralized configuration for animation libraries.

## Best Practices
No new class names: Always use existing Webflow classes or data attributes.
No jQuery or frameworks: Pure ES6+ JavaScript only.
Keep logic modular: One feature per file for maintainability.
Centralize config: Use config objects for all tweakable values.

## License
MIT