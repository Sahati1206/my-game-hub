# Project Updates (consolidated)

This folder consolidates development logs and Copilot activity related to `my-game-hub`.

Files included:
- `2025-12-10-update.md` — Comprehensive dev log describing recent changes (animations, badges, recently-played, Blackjack tweaks, etc.).
- `copilot-log.txt` — Copilot activity notes (game additions and planned work).
- `copilot.log.md` — Short Copilot activity summary.

Which update entries affect the `games/` folder or per-game code
- `src/components/GameCard/GameCard.jsx` — Decoration layer, hover/prefetch behavior and badge UI (affects how game cards present and prefetch games).
- `src/games/GameRegistry.jsx` — Game lazy-import registry and `prefetchGame()` used by `GameCard`.
- `src/games/Game11/Blackjack.jsx` (and other `src/games/*`) — Game-specific logic updates mentioned (Blackjack double-bet, hide dealer card until reveal).
- `src/pages/PlayPage.jsx` — Play overlay: mounts games, calls `addRecentlyPlayed`, and renders `Confetti`.
- `src/pages/GameLibrary.jsx` — Recently Played strip, staggered grid entrance; affects how games are listed.
- `src/utils/badges.js` — Badge awarding helpers which games should call when PRs are beaten (affects game logic integration).
- `src/utils/recentlyPlayed.js` — Stores last-played entries (affects PlayPage and GameLibrary).
- `src/components/Confetti/Confetti.jsx` — Celebration overlay listening for `badge:beat-pr` events (triggered by games).
- `src/data/games.json` — Game metadata used to render the library (titles, thumbnails, ids).

Notes about the consolidation
- I copied important logs into this folder and replaced root log files with pointers to avoid duplication.
- The original `dev-logs/2025-12-10-update.md` has been updated to point to this folder.

Recommended next steps
1. Confirm a final name for this folder (suggestions: `updates`, `project-updates`, `changelogs`). I created `updates/` already — tell me if you'd like a different name and I'll rename it.
2. If you want the original root pointers deleted (to remove duplication entirely), confirm and I'll remove the pointer files (`copilot-log.txt`, `copilot.log.md`) from the repository root.
3. If you'd like, I can:
   - Create a short index (JSON) that maps each update file to referenced repo files (useful for programmatic auditing).
   - Run a sweep to automatically insert `awardBeatPR(gameId)` calls into games that update PRs (Clicker/Tetris first).

If you want me to rename the `updates/` folder (or remove the old pointers), tell me which name or whether to delete the pointer files and I'll apply the changes.
