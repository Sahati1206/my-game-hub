Concept of files

                                     ENG/English

Project (website) files — short descriptions (non-React code/files):

- `index.html`: Minimal HTML shell and app mount point served by Vite.
- `package.json`: Project metadata, dependencies and NPM scripts (dev/build/test).
- `vite.config.js`: Vite bundler/dev-server configuration and dev-time options.
- `tailwind.config.js`: Tailwind CSS configuration (theme, plugins, purge paths).
- `postcss.config.js`: PostCSS pipeline setup (Tailwind, autoprefixer).
- `eslint.config.js`: ESLint rules and code-style/linting configuration.
- `postcss.config.js`: PostCSS plugins and config used during CSS build.
- `README.md`: High-level project overview and developer notes.
- `public/`: Static assets copied verbatim to the build (icons, manifest, static images).
- `src/index.css`: Global CSS entry (Tailwind directives + custom overrides).


Updates folder files (already present):

- `updates/2025-12-10-update.md`: Short changelog for recent UI/animation edits.
- `updates/copilot-log.txt`: Raw assistant session log for debugging/history.
- `updates/copilot.log.md`: Markdown-formatted copilot session notes.
- `updates/concept-of-files.md`: This file — concise descriptions of project files.


Notes:
- This document focuses on top-level project/config files and the `public/`/`src/index.css` assets. It intentionally omits component-level React files and game JS files.
- Keep this file short; refer to the specific source files for implementation details.

Files added/edited by recent UI work (components & utilities):

- `src/components/GameCard/GameCard.jsx`: Main game tile — decorations, hover animations, accent bar, glow.
- `src/components/Confetti/Confetti.jsx`: Confetti effect component (listens for badge/PR events).
- `src/components/GameLoading/GameLoading.jsx`: Loader component (still contains some SVG `<animate>`s).
- `src/components/LoadingScreen/LoadingScreen.jsx`: Full-screen loading UI (SVG loaders).
- `src/games/GameRegistry.jsx`: Central lazy-import & prefetch helper for games.
- `src/pages/PlayPage.jsx`: Play mount page — triggers recently-played and confetti/badges.
- `src/pages/GameLibrary.jsx`: Library grid rendering `GameCard` tiles.
- `src/hooks/useLocalStorage.js`: LocalStorage helper used for recently-played and favorites.
- `src/hooks/useGameSearch.js`: Game search hook used by the library page.
- `src/utils/badges.js`: Badge logic and helpers for awarding PR/badges.
- `src/utils/recentlyPlayed.js`: Helper to persist and manage recently-played games.






                                       ALB/Shqip

These are the primary files we touched or added while implementing the animated decorations, glow, and logging consolidation. For exact diffs, check your VCS or the file modification timestamps.
Skedarët e projektit (website) — përshkrime të shkurtra (kode/skedarë jo-React):

-  `index.html:` Skelet minimal HTML dhe pika e montimit të aplikacionit e shërbyer nga Vite.
- `package.json:` Metadata e projektit, varësitë dhe skriptet NPM (dev/build/test).
- `vite.config.js:` Konfigurimi i bundler-it dhe dev-server-it Vite, si dhe opsionet gjatë zhvillimit.
- `tailwind.config.js:` Konfigurimi i Tailwind CSS (tema, plugin-e, rrugë purge).
- `postcss.config.js:` Konfigurimi i pipeline-it PostCSS (Tailwind, autoprefixer).
- `eslint.config.js:` Rregullat e ESLint dhe konfigurimi i stilit/lintimit të kodit.
- `postcss.config.js:` Plugin-et dhe konfigurimi i PostCSS të përdorura gjatë ndërtimit të CSS.
- `README.md:` Përmbledhje e nivelit të lartë të projektit dhe shënime për zhvilluesit.
- `public/:` Asete statike që kopjohen verbatim në build (ikona, manifest, imazhe statike).
- `src/index.css:` Hyrja globale e CSS (direktivat e Tailwind + mbivendosje të personalizuara).

Skedarët e dosjes updates (tashmë të pranishëm):

- `updates/2025-12-10-update.md:` Changelog i shkurtër për ndryshimet e fundit në UI/animacione.
- `updates/copilot-log.txt:` Log i papërpunuar i sesioneve të asistentit për debug/histori.
- `updates/copilot.log.md:` Shënime të sesioneve të copilot në format Markdown.
- `updates/concept-of-files.md:` Ky skedar — përshkrime koncize të skedarëve të projektit.

Shënime:

Ky dokument fokusohet në skedarët kryesorë të projektit/konfigurimit dhe asetet public/ / src/index.css. Qëllimisht i anashkalon skedarët React në nivel komponentësh dhe skedarët JS të lojës.

Mbajeni këtë skedar të shkurtër; për detaje të implementimit referojuni skedarëve burimorë specifikë.

Skedarë të shtuar/ndryshuar nga puna e fundit në UI (komponentë & utilitete):

- `src/components/GameCard/GameCard.jsx:` Pllaka kryesore e lojës — dekorime, animacione hover, shirit theksues, glow.
- `src/components/Confetti/Confetti.jsx:` Komponent për efektin confetti (dëgjon evente për badge/PR).
- `src/components/GameLoading/GameLoading.jsx:` Komponent loader (ende përmban disa SVG <animate>).
- `src/components/LoadingScreen/LoadingScreen.jsx:` UI e ngarkimit në ekran të plotë (loaderë SVG).
- `src/games/GameRegistry.jsx:` Regjistër qendror për lazy-import dhe ndihmë për prefetch të lojërave.
- `src/pages/PlayPage.jsx:` Faqja e luajtjes — aktivizon recently-played dhe confetti/badges.
- `src/pages/GameLibrary.jsx:` Grid e bibliotekës që renderon pllakat GameCard.
- `src/hooks/useLocalStorage.js:` Helper për LocalStorage i përdorur për recently-played dhe favorites.
- `src/hooks/useGameSearch.js:` Hook për kërkimin e lojërave i përdorur nga faqja e bibliotekës.
- `src/utils/badges.js:` Logjika dhe helper-at për dhënien e PR/badges.
- `src/utils/recentlyPlayed.js:` Helper për ruajtjen dhe menaxhimin e lojërave të luajtura së fundmi.