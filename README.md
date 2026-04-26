# Whop Connection

This folder contains a minimal local Whop API connection setup.

## Files

- `.env` stores your private Whop API key. It is ignored by git.
- `.env.example` documents the required environment variables.
- `game/` contains the editable Flappy Sheep web game.
- `lib/whop-client.mjs` creates an authenticated Whop API fetch client.
- `scripts/check-whop-connection.mjs` checks whether the configured token can access a Whop endpoint.
- `scripts/serve-game.mjs` serves the game locally without extra dependencies.

## Usage

Add your Whop API key to `.env`:

```env
WHOP_API_KEY=your_key_here
WHOP_COMPANY_ID=biz_QYSyOGcmJ1vFQL
WHOP_PRODUCT_ID=prod_emyufQzVIqXK9
WHOP_CHECK_PATH=/api/v5/me
```

The saved dashboard target is:

```text
https://whop.com/dashboard/biz_QYSyOGcmJ1vFQL/products/prod_emyufQzVIqXK9/
```

Then run:

```sh
npm run whop:check
```

Note: `/api/v5/me` is for user/OAuth or app proxy tokens. If your key is a company API key, set `WHOP_CHECK_PATH` to an endpoint your key has permission to access.

## Flappy Sheep game

Live site:

```text
https://batilloyev.github.io/flappy-sheep-whop/
```

The game source is in `game/`:

- `game/index.html` defines the page and HUD.
- `game/styles.css` controls the arcade layout and responsive design.
- `game/game.js` controls gameplay, scoring, difficulty, collisions, and restart behavior.

Run the local game server with:

```sh
npm run game:serve
```

Then open:

```text
http://localhost:4173
```

To put this game on Whop, deploy the `game/` folder to a public HTTPS host and update the Flappy Sheep Whop app's `Base URL` to that hosted URL.
