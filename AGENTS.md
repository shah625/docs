# Documentation project instructions

## About this project

- This is the public documentation site for **updown**, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links
- `docs-*-request.md` / `docs-*-response.md` are working files exchanged with the production codebase, ignored by Mintlify: `docs-audit-*` (July 2026 refresh), `docs-rebuild-*` (September 2026 pivot from Theta Labs to updown), `docs-update-*` (late September 2026: options on stock tokens added, interval markets narrowed to stocks and crypto, cash moved to USDG on Robinhood Chain).

## Terminology

- The product name is **updown**, always lowercase, even at the start of a sentence.
- There are two products: **Options** (nav label **Options**) and **interval markets** (nav label **Interval**). Home is labelled **Explore**.
- **Options** are updown's own cash-settled **calls and puts** on a stock's **token on Robinhood Chain**. Never call them listed, exchange-traded, or brokered options. The in-app names are "Above $X" (call, **Up** outlook) and "Below $X" (put, **Down** outlook).
- Use **contract** for both products, and say "interval contract" or "option contract" wherever the two could be confused. Never "share".
- Use **window** for one round of an interval market, **to beat** for the opening price, **Up** and **Down** for the two sides. Cadences are **5 min / 15 min / 60 min** only.
- Cash is **USDG** on **Robinhood Chain**. Deposits are USDG on Robinhood Chain, USDC on Polygon (routed automatically), or card and bank. Withdrawals are USDG on Robinhood Chain. Do not use "pUSD".
- Balance terms: **Cash** and **Portfolio** are the top-bar figures. **Available cash** and "$X in positions" are the Portfolio value card. **Buying power** appears only in Live Positions. **Wallet** appears only in the options order panel. Do not use "Available", "In position", "Total traded", or "Balance card".
- The one-time approval is **Allow trading** (the panel is headed "Enable trading").
- The competition is the **Tournament**. Do not use "Weekly Trading Competition" or "leaderboard" for it; the side panel's rolling boards are the **Leaderboard** tab.
- Do not use "Yes Call", "spot", "redeem", "prediction market", "sports", "outcomes", "daily / weekly / monthly", "Live hub", "Trade hub", "hold to buy", or "Start Trading". Those belong to discontinued products or removed features.

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Quote in-app copy verbatim when describing what the user sees
- Code formatting for file names, commands, paths, and code references

## Content boundaries

- Document only what ships in the Options and Interval products. Do not document the archived Theta Labs routes (predictions, spot, the old `/options` prediction-market options, narratives, community, arena, survey, api-docs), the admin dashboard, or referrals while they are hidden.
- Do not name data vendors for price feeds (the stock, crypto, weekend, or options pricing sources). Robinhood Chain is the exception, because the stock token is the product's underlying.
- State "no fee" for options and "a small taker fee built into the price" for intervals. Do not quote the fee formula or promise fee levels permanently.
- Do not list blocked countries; describe the in-app region indicator and point to support.
- Do not describe updown as the counterparty, market maker, or treasury behind trades. Do not mention the order book at all, including in quoted UI copy, or quote depth or price levels. Say trades fill "at the live quote", "at the current bid", or "at the current ask". Fee, spread size, price protection, and the partial-fill message are fine because users see them directly.
- Do not mention bots, admin accounts, hidden accounts, or the admin dashboard anywhere.
- Never use "bet", "betting", or "wager". Say "trade" or "trading".
- Say "same-day and next-day" for options expiries. "0DTE" appears only as Home's clock label.
- Mention selling options and the Neutral outlook only as "coming soon", matching the app.

## API tab (`api/`, `api-reference/`) — added 2026-10-06

The API tab is written for developers, market makers and AI agents, and follows different rules from the user guides (the owner's calls, 2026-10-06):

- The **order book** is described openly there (bids, levels, depth, checksums) — the API is the book. The user guides keep the rule above and never mention it.
- Fields the API returns are documented as they are, including `fee_schedule` (the fee formula) and `settlement_source` / `contract_terms` (the price sources) — they are public to anyone who calls the API.
- Still never say who provides liquidity or trades against API users: describe mechanics only (orders, bids, fills, the taker side).
- `api-reference/openapi.json` and `asyncapi.json` are GENERATED in the main repo (`packages/protocol`, `npm run generate -w packages/protocol`) — never edit them here; copy them over after a change. Each endpoint page in `api-reference/` is a stub pointing at one operation; its title and text come from the spec.
- Example API keys must be obvious fakes (`udk_live_0123456789abcdef_EXAMPLE…`). Never paste a real key, even a revoked one.
- Every number in an example (checksums, prices) must be real: compute checksums with the recipe on `api/websocket`.
