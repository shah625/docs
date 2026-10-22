# Documentation project instructions

## About this project

- This is the public documentation site for **updown**, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links
- `docs-*-request.md` / `docs-*-response.md` are working files exchanged with the production codebase, ignored by Mintlify. The current round is `docs-refresh-*` (October 2026: verifying the docs against `main @ 0a59b769`). Earlier rounds (`docs-audit-*`, `docs-rebuild-*`, `docs-update-*`) are in git history.
- The product hard-links three docs paths: `/introduction`, `/interval/multiplier`, and `/api/introduction`. Never move or rename them.

## Terminology

- The product name is **updown**, always lowercase, even at the start of a sentence.
- updown has one product: **interval markets**. Each market is Up or Down on a stock, crypto, or **Pre-IPO** price over a 5-, 15-, or 60-minute window. Cadences are **5 min / 15 min / 60 min** only.
- The **Multiplier** is a mode inside the interval ticket on stock and crypto markets, not a separate product. Its unit is a **multiplier order**.
- **Bundle** places several interval buys at once. It was called "Multi-buy"; mention that name only as the old name.
- Options are retired. Do not document options, calls, puts, strikes, premiums, or the Options page anywhere in the guides. Two exceptions:
  - `interval/multiplier` keeps its "What's in a multiplier order" section (regular contract, target option, higher-strike option), because it explains how a multiplier order pays (the owner's call, 2026-10-21).
  - The FAQ keeps "Can I still trade options?", answered "No" with a link to the Multiplier.
- Use **contract** for an interval contract. Never "share". Contracts can be fractional, in steps of 0.01.
- Use **window** for one round of a market, **to beat** for the level a window must beat, and **Up** and **Down** for the two sides.
- **To beat** is the previous window's final 60-second value, not an instant price.
- **The tie rule (since 1 October 2026):** Up wins when the close is **at or above** the price to beat, both rounded to 4 decimal places (DOGE: 7). Down needs a close strictly below. An unchanged close settles **Up**. Never write "strictly above" for Up or "ties go to Down". That rule applied before 1 October 2026 and still shows only in older window results.
- **Websocket naming:** a channel name is what you subscribe to, and a message's `type` is its own name: `prices` → `price`, `user_orders` → `user_order`, `market_positions` → `market_position`, `orderbook_delta` → `orderbook_snapshot` then `orderbook_delta`. Any table of channels shows both columns.
- Cash is **USDG** on **Robinhood Chain**.
  - Deposits: USDG on Robinhood Chain; USDC on Arbitrum, Base, or Polygon; USDC or USDT on Ethereum; or card, Cash App, and other crypto through **our payment partner**.
  - Withdrawals: USDG on Robinhood Chain.
  - Do not use "pUSD".
- Balance terms:
  - **Cash**, **Credit** (only while you hold trade credit), and **Portfolio** are the top-bar figures.
  - The Portfolio value card shows "Portfolio value" with "$X cash · $Y in positions".
  - **Buying power** appears only in Live Positions.
  - Do not use "Available cash", "Available", "In position", "Total traded", "Wallet", or "Balance card".
- **Trade credit** is a promo balance spent before your cash. **Points** are creator rewards that convert to trade credit. **ELO** is the trader rating.
- The one-time approval is **Allow trading** (the panel is headed "Enable trading").
- The competition is the **Trading Tournament**. The side panel's rolling boards are the **Leaderboard** tab.
- Do not use: "Yes Call", "spot", "redeem", "prediction market", "sports", "outcomes", "daily / weekly / monthly", "Live hub", "Trade hub", "hold to buy", "Start Trading", "Quick Buy", "0DTE", "Explore", or the Portfolio "Rank" stat. Those belong to discontinued products or removed features.

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Quote in-app copy verbatim when describing what the user sees
- Code formatting for file names, commands, paths, and code references

## Content boundaries (user guides)

- Document only what ships in interval markets, the Multiplier, and the account, money, and community features around them.
- Do not document: options, the mobile app (until its release is confirmed), referrals, the Explore page, window chat, past tournaments, the Portfolio **Orders** tab, the "Backed by Alliance" badge, the admin dashboard, or archived Theta Labs routes.
- Do not name data vendors for price feeds. Describe the sources generically: "a consolidated real-time feed of the US-listed stock price", "a 24/7 market that tracks where traders expect the stock to reopen", "a 60-second time-weighted average that combines trading on major exchanges", "a third-party pre-IPO market whose price tracks the company's implied valuation".
- Do not name the payment partner or the GIF provider. Say "our payment partner".
- Name Robinhood Chain on the money pages, because the balance is held there.
- Fees:
  - Intervals: "Orders that trade right away pay a small taker fee, built into what you spend and what 'To win' shows. Limit orders that wait and are filled later pay no fee. Nothing is charged at settlement."
  - Multiplier: "There's no separate fee line; the payouts on the ticket already reflect the price."
  - Do not quote a fee formula, a spread number, order-size limits, or maker rebate rates.
- Do not list blocked countries. State eligibility as the Terms do, and link `https://www.updown.fast/terms#eligibility` and `https://www.updown.fast/terms#restricted`. App pages (Terms, Privacy, `/liquidity-providers`) always take the full `https://www.updown.fast` URL, because a bare path resolves on the docs site.
- MDX treats `{…}` as code. Never leave a `{N}`-style placeholder in page text: use a real example value, or wrap it in backticks.
- Do not describe updown as the counterparty, market maker, house, or treasury behind trades.
- Do not mention the order book, depth, price levels, or "the book", even in quoted UI copy. Say trades fill "at the live quote", "at the current bid", or "at the current ask". "Resting" is fine for a waiting limit order.
- Do not mention bots, admin accounts, hidden accounts, or the admin dashboard anywhere.
- Never use "bet", "betting", or "wager". Say "trade", "spend", or "spent".
- Do not say "self-custodial", "your keys", or "revoke" about the wallet or **Allow trading**.

## API tab (`api/`, `api-reference/`) — added 2026-10-06

The API tab is written for developers, market makers, and AI agents. It follows different rules from the user guides (the owner's calls, 2026-10-06):

- The **order book** is described openly there (bids, levels, depth, checksums), because the API is the book. The user guides keep the rule above and never mention it.
- Fields the API returns are documented as they are, including `fee_schedule` (the fee formula) and `settlement_source` / `contract_terms` (the price sources). They are public to anyone who calls the API.
- Still never say who provides liquidity or trades against API users. Describe mechanics only: orders, bids, fills, the taker side.
- `api-reference/openapi.json` and `asyncapi.json` are GENERATED in the main repo (`packages/protocol`, `npm run generate -w packages/protocol`).
  - Never edit them here. Copy them over after a change.
  - Each endpoint page in `api-reference/` is a stub pointing at one operation. Its title and text come from the spec.
- Example API keys must be obvious fakes (`udk_live_0123456789abcdef_EXAMPLE…`). Never paste a real key, even a revoked one.
- Every number in an example (checksums, prices) must be real. Compute checksums with the recipe on `api/websocket`.
