# Portfolio and Jet's Office

Open **Jet's Office** from the portfolio sidebar. Use WASD or the arrow keys to move. Press E near the highlighted desk for My Gear or near the highlighted wall frames for My Certificates. Press E or Escape in either view to return to the office. The office includes a chess table, a pool table, and an arcade cabinet, and three NPCs walk and chat on their own.

## Local setup

1. Run `npm ci`.
2. Start the portfolio with `npm run dev`.
3. Open the portfolio and click **Jet's Office**.

Run `npm run build` for the portfolio and `npm run lobby:test` for movement and NPC tests. The tests use Node.js 24 or higher to import the lobby's TypeScript directly. If Vite's default config loader encounters filesystem restrictions, use `npm run dev -- --configLoader runner` for local development or `npx tsc -b` followed by `npx vite build --configLoader runner` for a production build.

GitHub Pages serves the static portfolio. Jet's Office runs in the browser.

## Art

The player avatar, desk, chair, computer, plants, and desk accessories use the free edition of Office Pixel Art. Jet's Office uses a project atlas of the selected sprites and recolors the included office worker for Wilster, Diether, and Jules. The free license permits project use and modifications with credit. The art is included as part of the portfolio and is subject to the creator's license. [Office Pixel Art by Imersa Studios](https://imersastudios.itch.io/office-pixel-art)

The room, sofa, chess table, pool table, arcade cabinet, bookshelf, and fallback sprites are original pixel drawings in `src/lobby/officeArt.ts`. The gear view uses original sprites in `src/lobby/gearArt.ts`.
