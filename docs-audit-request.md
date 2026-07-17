# Docs Audit Request — Theta Labs documentation vs. production code

> **To the agent receiving this file:** You are working inside the Theta Labs production codebase. This file was generated from the Theta Labs public documentation site (Mintlify), which was written several months ago and is believed to be significantly out of date. Your job is to audit every claim below against the **current** code and return a single response file (format specified in Section 5) that a docs writer — who has **no access to your codebase** — can use to bring the docs fully up to date.

---

## 1. Your mission and rules of engagement

**What to do:**

1. Go through the **claim inventory** in Section 3. For each claim, find the code that implements (or contradicts) it and assign a verdict:
   - `CONFIRMED` — the code matches the claim as written.
   - `OUTDATED` — the feature exists but the details have changed (numbers, labels, flows, names). Describe what it is **now**.
   - `WRONG` — the claim was never/is not accurate. Describe actual behavior.
   - `REMOVED` — the feature no longer exists.
   - `UNVERIFIED` — you could not find conclusive evidence either way. Say what you looked for.
2. Answer the **open questions** in Section 4.
3. List every **user-facing feature that exists in the code but has no claim in Section 3** — these are undocumented features that need new docs.
4. Fill in the response template in Section 5 and save it as `docs-audit-response.md`.

**Rules:**

- **Verify by reading code, not by assumption.** UI components, route definitions, constants, config, API handlers, and feature flags are your sources of truth. Cite a file path (and symbol/constant name where useful) as evidence for every non-CONFIRMED verdict.
- **Report what ships today.** If a feature is built but behind a disabled feature flag or unreleased, mark it and say so explicitly — the docs writer needs to know whether to document it.
- **Exact values matter.** The docs are full of specific numbers (refresh intervals, thresholds, starting balances, pagination sizes, time windows). When a claim has a number, confirm or correct the number, don't just confirm the feature exists.
- **Exact UI labels matter.** Docs tell users to "Click **Deposit**" etc. If a button/tab/page has been renamed, report the current label verbatim.
- **When correcting, write for a docs audience.** Describe the user-facing behavior and flow; include implementation detail only as evidence citations.
- **Don't guess.** `UNVERIFIED` with a note beats a confident wrong answer.

---

## 2. Current docs site map

The docs site ("Theta Labs", Mintlify) has one tab, **Guides**, with 5 groups and 14 pages:

| Group | Page (path) | What it currently covers |
|---|---|---|
| Get Started | `introduction` | Product overview: Polymarket + Kalshi aggregator, options, narratives |
| Get Started | `quickstart` | Sign in → deposit → find market → first trade |
| Get Started | `account-setup` | Privy auth, embedded wallets, funding, buying power, paper balance |
| Trading | `trading/spot-trading` | YES/NO shares, buying/selling, settlement |
| Trading | `trading/options-trading` | Calls/puts/selling, pricing, collateral, options chain, paper trading |
| Trading | `trading/narratives` | Market baskets: pricing, buying/selling, resolution |
| Trading | `trading/order-types` | Market orders, orderbooks (CLOB), spread, slippage |
| Portfolio | `portfolio/overview` | Portfolio value, P&L, sub-accounts, time ranges |
| Portfolio | `portfolio/deposit-withdraw` | Deposit/withdraw/transfer flows, supported assets |
| Portfolio | `portfolio/positions` | Positions panel: spot/narrative/options tabs, redeem, close early |
| Platform | `platform/markets` | Market feed, sort tabs, categories, daily markets, search, market detail page |
| Platform | `platform/watchlist` | Starring markets, dashboard watchlist row |
| Platform | `platform/leaderboard` | Live vs paper leaderboards, ranking columns, medals |
| Help | `help/faq` | Fees, eligibility, prediction-market basics, paper trading |
| Help | `help/glossary` | Term definitions |

Also in the repo but **not** in navigation: `api-reference/openapi.json` — this is the untouched Mintlify starter "Plant Store" sample spec, i.e. placeholder content (see open question Q-6).

The docs.json navbar links to GitHub repo `https://github.com/shah625/thetalabs`.

---

## 3. Claim inventory

Each claim has a stable ID. Reference these IDs in your response. Claims are grouped by docs page.

### Introduction (`introduction`) — INT

- **INT-1** — Theta Labs aggregates exactly two exchanges: Polymarket and Kalshi, in a single unified interface.
- **INT-2** — Product offers three trading modes: spot (YES/NO shares), options (calls/puts, sell premium), and narrative baskets.
- **INT-3** — Sign-in is one-click via email or social account; an embedded wallet is created automatically; no MetaMask/Phantom required.
- **INT-4** — Funding: USDC on Polygon for Polymarket trades, USDC on Solana for Kalshi trades.
- **INT-5** — Transfers between platforms are available from the Portfolio page.
- **INT-6** — Market discovery: unified feed, keyword search, plus "trending", "biggest movers", and "expiring soon" lists.
- **INT-7** — Options trading is **paper trading** with a $1,000 virtual starting balance; live options have not launched.
- **INT-8** — Market categories include politics, economics, crypto, sports "and more".

### Quick Start (`quickstart`) — QS

- **QS-1** — The app lives at `https://app.thetalabs.gg`.
- **QS-2** — The entry CTA is a button labeled **Launch App**.
- **QS-3** — Authentication is powered by **Privy**; supported methods include email and social accounts (Google, Apple, etc.).
- **QS-4** — The Portfolio page has a **Deposit** button that shows two wallets: an EVM wallet (Polygon) for Polymarket and a Solana wallet for Kalshi.
- **QS-5** — Correct deposit assets: **USDC.e on Polygon** for Polymarket; **USDC on Solana** for Kalshi.
- **QS-6** — Dashboard discovery sections are named **Trending**, **Biggest Movers**, and **Ending Soon**.
- **QS-7** — Market categories offered include politics, economics, crypto, sports, entertainment, and weather.
- **QS-8** — Trade flow: open market page → select **Yes** or **No** → enter a dollar amount → confirm; the new position appears in a positions panel on the **right side of the dashboard**.

### Account Setup (`account-setup`) — AS

- **AS-1** — Sign-in via Privy with email or social; no external wallet required.
- **AS-2** — First sign-in automatically creates an **embedded wallet** tied to the login; no seed phrase to manage.
- **AS-3** — Embedded wallets are **non-custodial**; Theta Labs never holds private keys; keys are encrypted via Privy infrastructure.
- **AS-4** — Every user gets exactly **two wallets**: EVM wallet on Polygon (for Polymarket) and Solana wallet (for Kalshi).
- **AS-5** — Both wallet addresses are viewable under **Portfolio → Deposit**.
- **AS-6** — Sending USDC on the wrong network results in unrecoverable lost funds (i.e., there is no recovery mechanism/support path).
- **AS-7** — Polymarket funding flow: deposit USDC.e on Polygon to the EVM address; after confirmation, balance appears under "Polymarket" on the Portfolio page; a **Transfer** button then moves funds from the Theta Labs holding wallet into the Polymarket account to make them tradeable.
- **AS-8** — Kalshi funding flow: deposit USDC on Solana; after confirmation, balance appears under "Kalshi" on the Portfolio page (no transfer step mentioned for Kalshi — verify whether Kalshi requires a transfer step or funds are tradeable directly).
- **AS-9** — **Buying power** is displayed on both the dashboard and Portfolio page, broken down by platform: Theta Labs (funds in Privy EVM wallet, not yet transferred), Polymarket (available USDC in Polymarket account), Kalshi (available USDC in Kalshi account); total = sum of all three.
- **AS-10** — New users receive a **$1,000 virtual paper-trading balance** for options on first sign-in.
- **AS-11** — The paper balance appears in an **Options** card on the Portfolio page, alongside realized P&L from paper trades, separate from live holdings.

### Spot Trading (`trading/spot-trading`) — SPOT

- **SPOT-1** — Shares are priced $0–$1; winning shares settle at exactly $1.00, losing shares at $0.00.
- **SPOT-2** — YES price + NO price always equal $1.00 (verify: is this displayed/assumed, or do spreads make this untrue in the UI?).
- **SPOT-3** — Polymarket markets settle in USDC.e on Polygon; Kalshi markets settle in USDC on Solana.
- **SPOT-4** — Search bar on the Trade page searches by keyword/topic/person; categories are browsable.
- **SPOT-5** — Source badges: Polymarket markets show a **blue "Poly" badge**; Kalshi markets show a **purple "Kalshi" badge**.
- **SPOT-6** — Buy flow: pick market → choose YES or NO → enter dollar amount **or** share count → panel shows estimated shares and cost → click **Buy** → fills at best available price.
- **SPOT-7** — Users can sell shares any time before resolution; flow: open market → **Sell** → enter share count → confirm; proceeds at current market price.
- **SPOT-8** — Settlement is automatic: winning shares pay $1.00, credited to the wallet with **no manual claim needed**. (Note: the Positions page claims the opposite — a manual **Redeem** click is required; see POS-6/POS-7. Resolve this contradiction: which is it, per platform?)

### Options Trading (`trading/options-trading`) — OPT

- **OPT-1** — Options are derivatives on prediction-market probabilities; strike is a probability threshold; contracts have expiry dates.
- **OPT-2** — Options are **paper trading only**, $1,000 virtual starting balance, no real funds.
- **OPT-3** — Contracts expire **weekly or monthly**.
- **OPT-4** — Pricing uses a **Bachelier-style model** accounting for time to expiry, implied volatility, and distance from current probability.
- **OPT-5** — Call payoff at expiry: `max(market price − strike, 0)` per contract. Put payoff: `max(strike − market price, 0)`.
- **OPT-6** — Selling (writing) options is supported; the seller collects premium and must post collateral.
- **OPT-7** — Collateral per contract: sell call at strike K = `max(1 − K − premium, 0)`; sell put at strike K = `max(K − premium, 0)`.
- **OPT-8** — For sells, **return on collateral** and an **annualized yield estimate** are displayed before trade confirmation.
- **OPT-9** — The options chain shows per contract: strike (as %), expiry date, type (call/put), ask price, bid price.
- **OPT-10** — Trade flow: choose market from Options section → select strike & expiry → choose call/put/sell → set contract quantity → modal shows total cost or collateral, max profit, max loss → a **payoff diagram (P&L chart)** is displayed → confirm.
- **OPT-11** — Orders fill **instantly against the platform market maker** (no orderbook, no slippage for options).
- **OPT-12** — Open positions display: mark price vs entry, unrealized P&L, days to expiry, and **Greeks: delta, gamma, theta, vega**.
- **OPT-13** — Positions can be closed early via **Close Position**; at expiry, settlement is automatic based on final market probability.
- **OPT-14** — Paper balance persists across sessions; cumulative P&L tracked in an options dashboard.

### Narratives (`trading/narratives`) — NAR

- **NAR-1** — A narrative is a curated basket of 2+ related markets from Polymarket and/or Kalshi, each with a percentage weight.
- **NAR-2** — Two kinds exist: official **Theta Labs Narratives** (curated by the team) and **Social Narratives** (creatable by any user, shareable with the community).
- **NAR-3** — Composite price = weighted average of constituent YES prices: `Σ (market YES price × weight %)`, updating in real time.
- **NAR-4** — Weights are **fixed at creation time** and visible on the narrative detail page.
- **NAR-5** — The Narratives page is split into "Theta Labs Narratives" and "Social Narratives" sections; a **Top Movers** sidebar shows the largest 24h swings.
- **NAR-6** — Narrative cards show: composite YES price (cents), 24h change, number of constituent markets, combined volume, and source badges.
- **NAR-7** — Buying: enter share count → cost at current composite price → **paper trading balance is debited** (narratives use the **same $1,000 paper balance as options** — verify: is narrative trading paper or live?).
- **NAR-8** — Capital allocation on buy: split across constituents by weight; shares per market = `floor(allocated capital ÷ market price)`.
- **NAR-9** — Selling: partial closes allowed; proceeds credited to paper balance at current composite price; realized P&L recorded.
- **NAR-10** — Resolution: constituents resolve independently; payout is proportional to weights of markets that resolved favorably; all-wrong = worthless.
- **NAR-11** — Open narrative positions appear in a sidebar **Positions** panel showing shares, current composite price, and unrealized P&L.

### Order Types (`trading/order-types`) — ORD

- **ORD-1** — **All spot trades are market orders only** — no limit orders offered. (Verify: has limit-order support been added?)
- **ORD-2** — Execution: order checks best ask/bid, submits to the exchange, fills across price levels as needed.
- **ORD-3** — Polymarket uses a CLOB — off-chain matching, on-chain settlement on Polygon.
- **ORD-4** — Kalshi uses a traditional limit-order exchange book; trades settle on Solana via USDC.
- **ORD-5** — Options trades execute instantly against the platform market maker at the quoted price — no orderbook slippage (same as OPT-11).
- **ORD-6** — No slippage-protection setting is documented (verify: does the UI have a max-slippage control or price-impact warning?).

### Portfolio Overview (`portfolio/overview`) — PO

- **PO-1** — Total portfolio value = buying power (Theta Labs wallet + Polymarket + Kalshi) + open position value (Polymarket & Kalshi shares).
- **PO-2** — The total value display **updates every 30 seconds**.
- **PO-3** — P&L shown combines unrealized + realized over the selected time range; green for gains, red for losses.
- **PO-4** — Chart: hover tooltip with exact value; period **high and low annotations**; range selector in the top-right.
- **PO-5** — Time ranges: **1D, 1W, 1M, 1Y, ALL** (ALL = since account creation).
- **PO-6** — Three sub-accounts table: Theta Labs (Privy EVM wallet, Polygon, holds USDC and USDC.e), Polymarket (Polygon trading wallet, USDC.e collateral), Kalshi (Privy Solana wallet, USDC).
- **PO-7** — The Options card is a separate paper account, starts at $1,000, and is **not included in total portfolio value**.

### Deposit & Withdraw (`portfolio/deposit-withdraw`) — DW

- **DW-1** — **Deposit**, **Withdraw**, and **Transfer** buttons sit at the top of the Portfolio page.
- **DW-2** — Deposit modal shows the EVM address (`0x…`) with copyable address and a **QR code**.
- **DW-3** — Polygon deposits: USDC.e (bridged) is the primary asset; **native USDC on Polygon is also accepted**. (Verify this carefully — it contradicts the warning in the same page's intro and in DW-8.)
- **DW-4** — The deposit modal has a **Solana tab** showing the Solana address; only USDC (not USDT etc.) accepted on Solana.
- **DW-5** — Stated timing: Polygon confirms in seconds but balance may take a few minutes to appear; Solana confirms quickly, allow a few minutes.
- **DW-6** — Withdraw flow: Withdraw modal → select source (Polymarket or Kalshi) → shows available balance → confirm → funds arrive in the corresponding Theta Labs wallet (EVM for Polymarket, Solana for Kalshi). (Verify: can users also withdraw to an **external** address from the Theta Labs wallets, and is there a fee/minimum?)
- **DW-7** — **Transfer** moves USDC between the Theta Labs EVM wallet and the Polymarket account (both directions), Polygon-only, settling within minutes. No Kalshi transfer is documented (verify whether a Kalshi-side transfer step exists).
- **DW-8** — Supported assets table: Theta Labs wallet = USDC.e or USDC on Polygon; Polymarket = USDC.e on Polygon; Kalshi = USDC on Solana.

### Positions (`portfolio/positions`) — POS

- **POS-1** — The positions panel lists open trades across four types — Polymarket, Kalshi, Narratives, Options — with tab filters, and is available both on the Portfolio page and as a **floating panel on the dashboard**.
- **POS-2** — Spot position columns: Market, Allocation (% of total with a bar), Outcome (YES green / NO red), Shares, Avg price (as 0–1 probability), Current, Est. value, P&L, P&L (%).
- **POS-3** — A **Sum row** at the top aggregates total estimated value and total P&L.
- **POS-4** — Narrative position cards show: title, shares, current basket price (cents), unrealized P&L, current value.
- **POS-5** — Options positions show: contract type (call/put, long/short), strike (%), quantity, unrealized P&L; clicking opens a position detail page.
- **POS-6** — Redeemable positions are **detected automatically** when a market resolves and flagged in the positions list.
- **POS-7** — Redemption is **manual**: open the market page → click **Redeem** → confirm transaction → USDC credited (Polygon for Polymarket, Solana for Kalshi). (Contradicts SPOT-8's "automatic, no action needed" — establish the real behavior per platform.)
- **POS-8** — Early close flow: position row → market page → **Sell** tab → enter shares → confirm; proceeds return to Polymarket/Kalshi buying power immediately.

### Markets (`platform/markets`) — MKT

- **MKT-1** — The Markets page shows a unified grid of market cards from both exchanges, **sorted by 24h volume by default**, with a source badge per card.
- **MKT-2** — Four sort tabs: **Trending** (highest 24h volume), **New** (created in last **48 hours**), **Biggest Movers** (largest 24h price change), **Closing Soon** (expiring within **7 days**, sorted by expiry).
- **MKT-3** — Category filter bar with these categories: Politics, Crypto, Economics, Sports, Entertainment, Science & Tech, Weather, Culture, World.
- **MKT-4** — When **All** is selected, **sports markets are hidden by default**.
- **MKT-5** — Dashboard has three curated lists: **Trending** (top **5** by 24h volume, deduplicated by event), **Biggest Movers** (largest absolute 24h change, with a gainers/losers toggle), **Ending Soon** (closing within **48 hours**).
- **MKT-6** — A star icon on market cards adds to watchlist.
- **MKT-7** — A **Daily** tab shows only markets expiring **today or tomorrow**, interleaving Polymarket and Kalshi so neither dominates.
- **MKT-8** — Daily market types include: crypto price closes (BTC/ETH/SOL/XRP/DOGE), city high-temperature weather markets, NBA/NHL game winners.
- **MKT-9** — Daily view filters out markets with probability **below 5% or above 95%**.
- **MKT-10** — Search covers all active markets from both exchanges, matching on market **titles**, with instant results.
- **MKT-11** — Market card fields: title, image, YES probability (%), 24h change (green/red), lifetime volume, source badge.
- **MKT-12** — Multi-outcome events: card shows the top outcome by probability; all outcomes expandable on the trade page.
- **MKT-13** — Market detail page has three sections: price history chart (ranges 1D/1W/1M/1Y/All, hover tooltip), live **orderbook** (bids/asks per level), and **event siblings** (related markets of the same event listed below the chart).

### Watchlist (`platform/watchlist`) — WL

- **WL-1** — Watchlist is saved to the account and **persists across sessions and devices**.
- **WL-2** — Add: click the star on any market card; it turns **yellow**; the market appears in a **Watchlist row at the top of the dashboard**, above Trending/Biggest Movers.
- **WL-3** — Watchlist cards show: title + image, current YES probability, 24h change, filled yellow star.
- **WL-4** — Watchlist probability **updates every 60 seconds**.
- **WL-5** — Remove: click the yellow star again from dashboard or feed; card fades out of the row.

### Leaderboard (`platform/leaderboard`) — LB

- **LB-1** — The leaderboard lives on the **Social** page with a mode toggle at the top: **live trading** vs **paper trading**.
- **LB-2** — Live mode ranks by combined realized + unrealized P&L across all Polymarket and Kalshi spot trades, updating in real time.
- **LB-3** — Active daily traders are eligible for a share of the **Kalshi and Polymarket builder-program rebate pool**. (Verify: does this program still exist, and what are the current terms?)
- **LB-4** — Paper mode covers options **and** narrative P&L, measured against the starting virtual balance; it powers a **trading tournament** where top finishers earn prizes from a prize pool. (Verify: is a tournament currently running / still a feature?)
- **LB-5** — Table columns: Rank, Trader (display name or wallet address), Volume, Total P&L, Return (P&L as % of volume).
- **LB-6** — Pagination in groups of **10**.
- **LB-7** — Top three rows get gold/silver/bronze medal styling.
- **LB-8** — Traders appear only after their first trade in the selected mode; display name comes from the account profile.

### FAQ (`help/faq`) — FAQ

- **FAQ-1** — Theta Labs charges **no platform fee** for accounts, browsing, or market data; only underlying exchange fees apply, reflected in displayed prices. (Verify: has Theta Labs introduced its own trading fee, spread, or markup?)
- **FAQ-2** — Users can optionally **connect an existing self-custody wallet** instead of the embedded wallet. (Verify: is external wallet connect actually supported?)
- **FAQ-3** — Eligibility: Kalshi is US-regulated (CFTC) and restricted to eligible US residents; Polymarket availability varies by jurisdiction and is **not available to US residents**. (Verify against current integration — Polymarket's US status has changed in the real world; what does the app enforce/display now?)
- **FAQ-4** — Cancelled/voided markets refund all positions at original purchase price.
- **FAQ-5** — Deposit timing guidance: Polygon ~1–2 min, Solana often <30 s; contact support if >15 min. (Verify: what is the actual support channel — email, Discord, in-app?)
- **FAQ-6** — Max loss: spot buyers and option buyers can't lose more than they paid; option sellers' loss is capped at posted collateral.

### Glossary (`help/glossary`) — GLO

Most glossary entries restate claims above (paper trading, strikes as probability thresholds, CLOB, embedded wallets, Kalshi-on-Solana, Polymarket USDC.e, etc.) — corrections to earlier IDs apply here too. Verify separately:

- **GLO-1** — "Condition ID": each Polymarket market has a unique condition ID used to track/settle positions — is this term surfaced anywhere in the Theta Labs UI (if not, it may not belong in a user glossary)?
- **GLO-2** — "Open interest" is defined — is open interest actually displayed anywhere in the app?
- **GLO-3** — The name "Theta Labs" is said to be inspired by the options Greek theta — confirm this is the story the team wants in public docs.
- **GLO-4** — Buying power definition: decreases on open, increases on close/settlement — consistent with current wallet mechanics?

---

## 4. Open questions

Answer each in your response:

- **Q-1 (New features)** — What user-facing features exist in the app today that have **no claim above**? For each: name, where it is in the UI, what it does, and the full user flow (see the "New features" template in Section 5). Examples of things to look for: new trading modes, social features (profiles, comments, following, sharing), notifications/alerts, referral or rewards programs, mobile app, onboarding changes, fiat on-ramp, new asset/chain support, API keys, AI features, settings pages.
- **Q-2 (Options status)** — Is options trading still paper-only with a $1,000 virtual balance, or has live options trading launched (fully or partially)? If live: funding, fees, collateral, and settlement details.
- **Q-3 (Narratives status)** — Is narrative trading still paper, or live? Can users still create Social Narratives? Any creation constraints (min/max markets, weight rules, moderation)?
- **Q-4 (Renames/moves)** — Have any pages, routes, or feature names changed? (Dashboard vs Markets vs Trade vs Social page names; is the leaderboard still under "Social"?) List current top-level navigation of the app so the docs' vocabulary can match it.
- **Q-5 (Exchanges)** — Are Polymarket and Kalshi still the only two integrated exchanges? Any added or removed? Any change to which chains/tokens are used for each (e.g., Polymarket USDC.e vs native USDC migration)?
- **Q-6 (API)** — Does Theta Labs expose a public API worth documenting? The docs repo contains only the Mintlify placeholder "Plant Store" OpenAPI spec (not linked in navigation). If a real public API exists, can you provide/point to a real OpenAPI spec? If not, we'll delete the placeholder.
- **Q-7 (Links & branding)** — Confirm the current app URL (`app.thetalabs.gg`?), marketing site URL, correct public GitHub URL (docs navbar currently points to `github.com/shah625/thetalabs`), support channel (email/Discord/X), and any social links that should be in the docs footer.
- **Q-8 (Compliance wording)** — Is there current legal/compliance-approved wording about jurisdiction eligibility, fees, and risk that the docs should use verbatim (especially re: FAQ-3)?

---

## 5. Required response format

Return **one file**, `docs-audit-response.md`, structured exactly like this. The docs writer will apply it without access to your codebase, so completeness beats brevity — but keep everything user-facing.

```markdown
# Docs Audit Response — generated <date> from <repo/branch/commit>

## A. Claim verdicts

### Confirmed
Comma-separated list of all CONFIRMED claim IDs (no prose needed):
INT-1, INT-2, QS-3, ...

### Corrections
One row per claim that is OUTDATED / WRONG / REMOVED / UNVERIFIED:

| ID | Verdict | What the app actually does now (user-facing, specific: labels, numbers, flows) | Evidence (file path / symbol) |
|----|---------|--------------------------------------------------------------------------------|-------------------------------|
| QS-1 | OUTDATED | App moved to https://... | apps/web/... |

## B. Per-page change list
For each docs page with changes, plain-language edits:

### quickstart
- EDIT: Step 3 — deposits now support ... (per QS-5 correction)
- REMOVE: The note about ...
- ADD: A step covering ...

## C. New / undocumented features
One subsection per feature found in code but absent from Section 3:

### <Feature name>
- **Where in the UI:** page/menu path, exact labels
- **What it does:** 2–3 sentences, user perspective
- **User flow:** numbered steps with exact button/tab labels
- **Key numbers/limits:** fees, minimums, intervals, caps
- **Caveats:** flags, beta status, eligibility restrictions
- **Suggested docs placement:** new page (which group) or section on an existing page

## D. Open question answers
Q-1: ...
Q-2: ...
(through Q-8)

## E. Navigation suggestions
- Pages to add / delete / rename / regroup, with reasons.
```

Notes for you, the responding agent:

- If a correction affects a fact repeated on several pages (e.g., the $1,000 paper balance appears on ~8 pages), correct it **once** in the verdict table against every affected ID — you can group IDs in one row when the correction is identical (e.g., `INT-7, AS-10, OPT-2, NAR-7, PO-7, ...`).
- Section C is the most valuable part of your response. The docs currently describe the product as of months ago; anything shipped since is invisible to the docs writer unless you describe it here in full.
- If the codebase has its own docs, changelogs, or marketing copy that postdate this snapshot, cite them — they're good sources for tone and naming.
