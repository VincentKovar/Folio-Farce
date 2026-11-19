
# Folio & Farce

**A comedy plot generator and outline studio for writers.**

Folio & Farce builds a full comedy outline from a few choices: how many characters, which medium, and which comedic subgenre. You can lock the cards you love, reroll the ones you don't, and export the result as a Markdown outline ready for drafting.

<img width="900" alt="Screenshot Folio and Farce Plot Generator" src="https://github.com/user-attachments/assets/3b4080d8-80ac-437f-9c2f-5e9247e6435f" />


## Where it comes from

In the pulp era, writers kept plot machines on their desks. Lester Dent's famous master fiction formula, Erle Stanley Gardner's plot wheel, and William Wallace Cook's *Plotto* all treated story structure as a set of parts you could shuffle, swap and rebuild. Folio & Farce borrows that idea and points it at comedy. Instead of murders and mysteries, the parts are flaws, secret goals, farcical collisions and running gags.

## What it does

- **Generates a complete comedy plot:** title, logline, setting, comedic engine, cast, beat sheet and running gags.
- **Tailors the outline to your medium:** Novel, Feature Screenplay, Stage Play, Podcast, Sitcom or Sketch. Each has its own beat structure and format cues, such as chapter counts, page ranges, sluglines, entrances and exits, or sound cues.
- **Blends comedic subgenres:** pick a primary and an optional secondary from Satire, Slapstick, Screwball, Dark Comedy, Mockumentary, Absurdist, Fish Out of Water, Comedy of Manners, Parody and Buddy Road.
- **Scales the cast:** 1 to 6 characters, each with an archetype, a comedic flaw and a conflicting secret goal.
- **Takes a premise seed:** type your own constraint or leave it blank and let the machine invent one.
- **Locks and rerolls cards:** lock the title, setting, any character, any beat or any running gag, then regenerate everything else around what you kept. You can also reroll a single card.
- **Exports to Markdown:** download or copy an outline with drafting prompts and a medium-specific starter scaffold (a slugline opening, a stage set checklist, a podcast cold open, and so on).
- **Saves a library:** keep plots in your browser and reload them later.

## Two ways to generate

| Mode | What it is | Needs an API key? |
|---|---|---|
| **Writer's Room AI** | Uses the Gemini API to write a fresh, premise-aware plot that respects your locked cards | Yes |
| **Fiction Factory Deck** | Assembles a plot from built-in decks of names, archetypes, flaws, goals, settings and gags | No |

The Deck mode works fully offline, so you can use the app without any setup.

## Getting started

### Package manager

This project works with either **npm** or **[Bun](https://bun.sh/)**. The repo includes a `bun.lock` file because it was started with Bun, but the scripts are plain Node tooling, so npm works too.

| Task | npm | Bun |
|---|---|---|
| Install dependencies | `npm install` | `bun install` |
| Start the app | `npm run dev` | `bun run dev` |
| Build | `npm run build` | `bun run build` |

Use one or the other, not both. Mixing them can create conflicting lockfiles.

[Node.js](https://nodejs.org/)

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Add your Gemini key for Writer's Room AI
cp .env.example .env
# then edit .env and set GEMINI_API_KEY

# 3. Start the app
npm run dev
```

Then open <http://localhost:3000>.

If you skip the API key, switch the app to **Fiction Factory Deck** and everything still works.

### Other scripts

| Command | Purpose |
|---|---|
| `npm run build` | Build the front end with Vite |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove build output |

## Project structure

```
server.ts                      Express server and Gemini API routes
src/
  App.tsx                      App state, generation and locking logic
  components/                  Config studio, story deck, library, Markdown panel
  lib/comedyCatalog.ts         Mediums, beat templates and subgenre definitions
  lib/fictionFactoryDeck.ts    Offline deck generator
  lib/markdownExporter.ts      Markdown outline export
  types/plot.ts                Shared types
```

## Built with

React, TypeScript, Vite, Tailwind CSS, Express and the Google Gemini API.

## Notes

- Saved plots live in your browser's local storage, so they stay on your device and are cleared if you clear site data.
- Your API key stays on the server and is never sent to the browser.

## Credits

Inspired by the plot machines of Lester Dent, Erle Stanley Gardner and William Wallace Cook (*Plotto*), reworked for comedy.

## License

MIT
