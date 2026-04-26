# Flappy Sheep Project Info

## Live links

- Live game: https://batilloyev.github.io/flappy-sheep-whop/
- GitHub repo: https://github.com/batilloyev/flappy-sheep-whop
- Whop product dashboard: https://whop.com/dashboard/biz_QYSyOGcmJ1vFQL/products/prod_emyufQzVIqXK9/
- Whop app dashboard: https://whop.com/dashboard/biz_QYSyOGcmJ1vFQL/developer/apps/app_njHO53e5VboUZO/

## Whop IDs

- Business/company ID: `biz_QYSyOGcmJ1vFQL`
- Product ID: `prod_emyufQzVIqXK9`
- App ID: `app_njHO53e5VboUZO`
- Product name: `Flappy Sheep`
- Business name: `Black Sheep`

## Current Whop app settings

- App name: `Flappy Sheep`
- Category: `Games`
- Base URL: `https://batilloyev.github.io/flappy-sheep-whop`
- Experience path: `/`
- App type: consumer-facing app
- Status: private app, not published to the Whop app store

## Current game features

- Free browser arcade game
- Tap/click/Space controls
- Pipe dodging gameplay
- Score counter
- Best score stored in the browser
- Golden clover pickups
- Coin counter
- Difficulty increases every 5 points
- Start and game-over screens
- Responsive layout for desktop and mobile

## Local files

- `game/index.html`: game page structure
- `game/styles.css`: visual design and responsive layout
- `game/game.js`: gameplay logic
- `game/assets/flappy-sheep-hero.png`: 16:9 Whop app store hero image
- `game/assets/flappy-sheep-gameplay.png`: 16:9 Whop app store gameplay image
- `scripts/serve-game.mjs`: local static server
- `lib/whop-client.mjs`: Whop API helper
- `scripts/check-whop-connection.mjs`: Whop API connection checker

## Local commands

Run the game locally:

```sh
npm run game:serve
```

Then open:

```text
http://localhost:4173
```

Check the Whop API connection:

```sh
npm run whop:check
```

## How to update the live game

After editing files in `game/`, commit and push the source:

```sh
git add game README.md PROJECT_INFO.md
git commit -m "Update Flappy Sheep game"
git push origin main
```

Then publish the `game/` folder to GitHub Pages:

```sh
git subtree push --prefix game origin gh-pages
```

If GitHub rejects the subtree push because history changed, create a fresh Pages branch from `game/` and push it:

```sh
git subtree split --prefix game -b gh-pages-update
git push origin gh-pages-update:gh-pages
git branch -D gh-pages-update
```

## Helpful next steps

- Upload the two 16:9 app store images from `game/assets/` in the Whop app settings.
- Add or replace the app icon with a clean 512x512 brand icon if needed.
- Publish the app only when you are ready for the Whop app store review.
- Keep the Whop product free while improving player acquisition.
- Later add a paid upgrade, such as private leaderboard events, skins, or score competitions.
- Add analytics when the game has real users, so you can see plays, retention, and conversion.

## Security notes

- The real Whop API key is stored only in `.env`.
- `.env` is ignored by git and should not be uploaded.
- Use `.env.example` only as the safe template.
