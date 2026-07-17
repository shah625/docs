# Docs Audit Response — generated 2026-07-15 from `thetalabs` `main` @ `4cd11b2`

> **Read this first.** The product has pivoted since the docs were written. On 2026-06-11 the team removed paper trading, tournaments, the V1 (Bachelier) options stack, and the old dashboard (internal record: `Claude Docs/26-CODEBASE-AUDIT.md`). What ships today:
>
> 1. **Options are the flagship product and they are REAL MONEY** — cash-settled calls on prediction-market probabilities, funded by a pUSD balance, filled instantly against a platform dealer book. There is no paper mode and no $1,000 virtual balance anywhere in the live app.
> 2. **Spot trading is Polymarket-only.** Kalshi/Solana trading is not live in the UI (backend scaffolding exists but no user can place a Kalshi trade or deposit on Solana).
> 3. **The app is three pages**: Options / Spot / Portfolio (top nav), plus a Leaderboard (trophy icon). There is no dashboard — `/app` redirects to `/app/options`. Watchlist, narratives, daily-markets tab, and the paper leaderboard are gone or orphaned.
> 4. **Money flow is one balance**: deposit USDC on Polygon → auto-converts to pUSD (no manual Transfer step) → trade → withdraw native USDC to any Polygon address (min $2). No sub-accounts, no "buying power by platform."
>
> Roughly 75% of the claim inventory is affected. The corrections table groups identical corrections.

---

## A. Claim verdicts

### Confirmed

INT-3, AS-1, AS-2, AS-3, SPOT-1, SPOT-6, SPOT-7, OPT-1, OPT-11, ORD-1, ORD-2, ORD-3, ORD-5, ORD-6, PO-3, PO-5, DW-2, POS-6, LB-7, LB-8, FAQ-2

Notes on a few confirmations (details, not corrections):
- **ORD-1**: still market-orders only, but the ticket now shows a disabled **"Limit · soon"** button ("Limit orders coming soon") — worth a "coming soon" note in docs (`apps/web/app/app/spot/[slug]/trade-ticket.tsx:154-170`).
- **ORD-6**: still no user-facing slippage control; a server-side 2% slippage guard is applied automatically (`packages/api/src/routers/orders.ts` `DEFAULT_SLIPPAGE_BPS = 200`). Ticket footer reads "Market order · fills at the best available price."
- **OPT-11 / ORD-5**: options fill instantly against the platform dealer ("Treasury") with no orderbook — but supply is now **limited by real collateral**; markets can show "Sold out" (see C-1).
- **DW-2**: the deposit surface is a modal titled **"Wallet"** with a QR code + copyable Polygon address (`apps/web/components/wallet/WalletModal.tsx`).
- **PO-5**: chart ranges are exactly 1D / 1W / 1M / 1Y / ALL, default **1W** (`portfolio-view.tsx:79`).

### Corrections

| ID | Verdict | What the app actually does now (user-facing, specific) | Evidence (file path / symbol) |
|----|---------|--------------------------------------------------------|-------------------------------|
| INT-7, AS-10, AS-11, OPT-2, OPT-14, PO-7 | REMOVED | Paper trading no longer exists anywhere in the live app. **Options are live, real-money trading** funded by the user's pUSD balance. There is no $1,000 virtual balance, no paper Options card on the Portfolio page, and no paper P&L dashboard. Docs must present options as real money with real risk. | `Claude Docs/26-CODEBASE-AUDIT.md` (decommission record); `packages/api/src/routers/optionsV2.ts` (buy debits real pUSD, ~line 1460); `apps/web/app/app/portfolio/portfolio-view.tsx` (no paper card) |
| INT-1, INT-4 | OUTDATED | Theta Labs currently trades on **Polymarket only**. Kalshi markets still appear read-only in the Ctrl/⌘+K search palette and in the Social activity feed, but there is **no Kalshi trading, no Solana deposits, and no USDC-on-Solana flow** in the UI. All funding is USDC on Polygon, auto-converted to pUSD. | `apps/web/app/app/spot/markets-browse.tsx:67` (`trpc.polymarket.markets` only); `packages/api/src/lib/orders/place.ts:1-3` ("Spot (Polymarket CLOB) order placement"); `WalletModal.tsx` (Polygon-only deposit) |
| AS-8, ORD-4, DW-4 | REMOVED | The Kalshi/Solana funding and trading path is not live. The deposit modal has **no Solana tab**; there is no "Kalshi" balance; no trades settle on Solana. (A Solana embedded wallet is still silently created at sign-up but is never surfaced.) | `apps/web/components/wallet/WalletModal.tsx:198-203` (single Polygon `DepositCard`); `packages/api/src/routers/trading.ts` (legacy DFlow code, no live web callers) |
| INT-2 | OUTDATED | Two trading modes ship today: **Options** (flagship, real money) and **Spot** (Polymarket YES/NO shares). Narratives is archived and nav-orphaned (see NAR row). | `apps/web/components/app-shell/Navbar.tsx:21-25` |
| INT-5, DW-7 | REMOVED | There is **no Transfer button and no transfer step**. Deposits auto-convert: send USDC to your Polygon address and it is swept to the Polymarket bridge and credited as pUSD automatically. The old TransferModal exists in the repo but is dead code with zero importers. | `packages/api/src/routers/deposits.ts:166-212` (`deposits.sweep`); `apps/web/components/portfolio/TransferModal.tsx` (unreferenced) |
| INT-6, MKT-1, MKT-2 | OUTDATED | The market feed is the **Spot** page (`/app/spot`), Polymarket-only, with four sort tabs: **Trending** (total volume), **Hot** (24h volume — the default), **New** (newest by start date; no 48-hour cutoff), **Ending soon** (soonest end date; no 7-day window). There is no "Biggest Movers" list and no source badges on cards. | `apps/web/app/app/spot/markets-browse.tsx:35-40` (`MODES`), `:62` (default = Hot); `packages/api/src/lib/markets/polymarket.ts:549-554` (sort mapping) |
| INT-8, QS-7, MKT-3 | OUTDATED | Category filter bar is exactly: **All, Politics, Sports, Esports, Crypto, Economy, Tech, Culture, World**. (No Entertainment, Weather, Science & Tech, or Economics labels.) | `markets-browse.tsx:43-53` (`CATEGORIES`) |
| QS-1 | UNVERIFIED | No app domain is hard-coded anywhere in the repo (the code is deliberately "dev & prod-subdomain agnostic"). The only `thetalabs.gg` reference in code is the support email `hello@thetalabs.gg`. Confirm the live app URL with the team before publishing. | `Navbar.tsx:48` (path normalization comment); grep for `thetalabs.gg` |
| QS-2 | OUTDATED | The landing-page CTA is **"Start Trading"** (routes to `/login`), not "Launch App". | `apps/web/app/page.tsx:73`; `apps/web/app/app/options/options-landing.tsx:497` |
| QS-3 | OUTDATED | Privy login methods are **email, Google, or an external wallet**. Apple is not offered. | `apps/web/components/providers/PrivyClientProvider.tsx:26` (`loginMethods: ["email", "wallet", "google"]`) |
| QS-4, AS-5 | OUTDATED | The Portfolio page's **Deposit** button opens a modal titled **"Wallet"** showing **one** deposit option: a QR + copyable **Polygon address** for USDC. No Solana wallet is shown. Both wallet addresses ("Deposit wallet (Polygon)" and "Signing wallet (Polygon)") are also listed on the **Profile** page with Polygonscan links. | `WalletModal.tsx:175-209`; `apps/web/app/app/profile/page.tsx:150-173` |
| QS-5, DW-3, DW-8 | OUTDATED | The deposit asset is **native USDC on Polygon** (modal header literally: "⚠ USDC on Polygon"). It auto-converts to **pUSD**, the single tradeable balance ("pUSD — your tradeable balance on Polymarket"). USDC.e is only an internal conversion intermediate and is never a displayed balance. Withdrawals pay out **native USDC on Polygon**. There is no Solana asset row. | `WalletModal.tsx:49, 175-180`; `packages/api/src/lib/trading/constants.ts:16-27` |
| QS-6, MKT-5 | REMOVED | There is **no dashboard**. `/app` redirects to `/app/options`. The Trending / Biggest Movers / Ending Soon curated rows no longer exist anywhere. | `apps/web/app/app/page.tsx:6` (`redirect("/app/options")`) |
| QS-8 | OUTDATED | Trade flow: open a market from **Spot** → pick **Yes** or **No** (buttons show price in cents, e.g. "Yes 62¢") → enter a **dollar amount or share count** (USD/Shares toggle) → review Avg price / Cost / To win → click **Buy**. New positions appear on the **Portfolio page** (positions tab) — there is no right-side dashboard panel. | `apps/web/app/app/spot/[slug]/trade-ticket.tsx`; `event-view.tsx:409-450` (SideButton) |
| AS-4 | OUTDATED | Two embedded wallets (EVM + Solana) are still created at first sign-in (`createOnLogin: "all-users"` for both chains), but **only the Polygon side is user-facing**. Docs should describe one Polygon wallet; the Solana wallet is dormant. | `PrivyClientProvider.tsx:28-33` |
| AS-6 | UNVERIFIED | The modal warns "Only send USDC on the correct network," but no recovery mechanism (or absence of one) is codified. There **is** a support path: in-app Contact page + `hello@thetalabs.gg`. Confirm the recovery policy with the team before stating funds are unrecoverable. | `WalletModal.tsx:205-209`; `apps/web/app/app/contact/page.tsx` |
| AS-7 | OUTDATED | Polymarket funding is now **fully automatic**: send USDC (Polygon) to your deposit address → the app detects it, sweeps it to the Polymarket bridge, and converts it to pUSD. Status stages shown in the modal: "Deposit detected…" → "Finalizing…" → "Converting your deposit to pUSD…". No Transfer click, no "Polymarket balance" line — the result is one **Available** (pUSD) balance. | `deposits.ts:92-124, 166-212`; `WalletModal.tsx:106-147` |
| AS-9, PO-6 | REMOVED | "Buying power by platform" and the three-sub-account table are gone. The Portfolio **Balance** card shows one number with three cells: **Available** (pUSD cash), **In position** (market value of spot + options positions), **Total traded** (lifetime volume). | `portfolio-view.tsx:157-170, 261-285` |
| SPOT-2 | UNVERIFIED | Yes/No prices come from the live Polymarket CLOB, which has a bid/ask spread, so the two displayed prices need not sum to exactly $1.00 at any instant. Recommend docs say prices are "complementary (approximately sum to $1)" rather than "always equal $1.00." | `apps/web/app/app/spot/[slug]/order-book.tsx` (spread row); CLOB quotes in `packages/api/src/routers/polymarket.ts` |
| SPOT-3 | OUTDATED | Winning Polymarket shares redeem to **pUSD** (the in-app balance), not raw USDC.e — you convert to USDC only when you withdraw. Kalshi settlement doesn't apply (not live). | `packages/api/src/routers/orders.ts:42-90` (`redeemSpot`); toast: "Redeemed — pUSD landing in your balance" |
| SPOT-4, MKT-10 | OUTDATED | Two search surfaces: (1) a **search box in the top nav** ("Search markets…") that filters the Spot grid via Polymarket's search API; (2) a **Ctrl/⌘+K command palette** ("Search prediction markets...") that title-matches a unified cache including Kalshi entries — but result links resolve to Polymarket market pages, so docs should describe search as Polymarket market search. | `Navbar.tsx:143-151`; `apps/web/components/app-shell/CommandPalette.tsx` |
| SPOT-5 | REMOVED | No source badges on market cards — the Spot feed is single-source (Polymarket). "Kalshi"/"Polymarket" labels appear only inside Ctrl+K search results and the Social activity feed. | `apps/web/app/app/spot/event-card.tsx` (no badge); `social-view.tsx:372-385` |
| SPOT-8, POS-7 | OUTDATED | Settlement credit is **manual, from the Portfolio page** (not the market page): when a market resolves in your favor the position row shows "resolved — you won" and a green **Redeem** button; clicking it credits pUSD (winning shares pay $1.00 each). SPOT-8's "no manual claim needed" is wrong; POS-7's location is wrong. | `portfolio-view.tsx:478, 608-646`; `orders.redeemSpot` |
| OPT-3 | OUTDATED | Expiry cadences are **daily, Mon/Wed/Fri, weekly (Fridays), and monthly (3rd Friday)**, standard expiry time **8:00 pm ET**, chosen per market. A market can also carry a hard **final expiry** on its resolution day (e.g. noon before a game). The market page shows "Expiring {Mon D} ({n}d)". | `packages/shared/src/options/expiries.ts:17, 49, 78-121`; `market-view.tsx:434-435` |
| OPT-4 | OUTDATED | Pricing is no longer Bachelier. V2 models the market's probability in **log-odds (logit) space** with a martingale correction, optional jump pricing around scheduled catalysts, and fat (Student-t) tails. For docs: "a probability-space options model built for prediction markets" is sufficient; quotes also include a market-making spread (see FAQ-1 row). | `packages/shared/src/options/{logit,jumps,tails,quote}.ts`; `index.ts:1-2` |
| OPT-5 | OUTDATED | Contracts are **calls only** — **Yes Calls** and **No Calls** (a No Call is a call on the No price; there are no puts). Payoff per contract = **max(settlement price − strike, 0)**, where the settlement price is the **average Yes/No price over the final 60 minutes before expiry** (time-weighted), or exactly 0/1 if the market resolves before expiry. In-app explainer: "How & When This Settles." | `packages/api/src/lib/options/settlement.ts:52-103, 183`; `market-view.tsx:571-609` |
| OPT-6, OPT-7, OPT-8 | REMOVED | Users **cannot sell/write options**. Only the platform dealer writes contracts, and each contract is fully backed by collateral the desk locks up front (that's why markets show limited capacity / "Sold out"). No user collateral formulas, no return-on-collateral or annualized-yield display. The Buy/Sell toggle's Sell side is disabled with "Selling to close is in your portfolio for now." | `market-view.tsx:296-305, 377-394`; `optionsV2.ts:1531-1623` (dealer-side lock) |
| OPT-9 | OUTDATED | The options chain shows one table per side + expiry with columns: **Strike** (as %), **Breakeven** (%), **Max return** (e.g. "4.2x"), **Ask** (in cents, with an add-to-ticket button). There is **no bid column** and no call/put type column (you pick Yes Call / No Call above the chain). A "Spot {pct}%" marker overlays the row nearest the live probability. | `market-view.tsx:458-549` (ChainTable) |
| OPT-10 | OUTDATED | Flow: **Options** page → pick a market card ("Yes Calls" / "No Calls" buttons) → choose expiry from the dropdown → tap an **Ask** price in the chain to add it to the ticket (multi-leg cart, Contracts/Dollars toggle) → review the **payoff-at-expiry chart** (draggable cursor) with **Max profit**, **Max loss**, and **Breakeven** → click **"Buy for $X"**. No collateral line (buyers post none). | `market-view.tsx:629-960` (PayoffChart, TicketPanel) |
| OPT-12 | OUTDATED | Open options positions (Portfolio page) show: market, side + strike ("Yes call · 20% strike"), **Qty**, **Avg** (entry ¢), **Now** (mark ¢), **Exp** (days to expiry), and unrealized P&L in $ and %. **No Greeks are displayed anywhere.** | `optionsV2.ts:957-1045` (`myPositions`); `portfolio-view.tsx:382-471` |
| OPT-13 | OUTDATED | Early close is **"Sell"** on the Portfolio position row → a "Sell {strike}% call" ticket showing current bid vs. your avg entry, contracts input, "You receive," "Realized P&L," and a **"Sell for $X"** button (fills at the dealer's bid). At expiry, settlement is automatic (hourly job): in-the-money contracts pay out in pUSD, out-of-the-money expire worthless. | `portfolio-view.tsx:661-749` (SellTicket); `apps/web/app/api/cron/settle/route.ts` |
| NAR-1, NAR-2, NAR-3, NAR-4, NAR-5, NAR-6, NAR-7, NAR-8, NAR-9, NAR-10, NAR-11, POS-4 | REMOVED | Narratives is **archived**: the pages still render at the direct URL `/app/narratives` but the feature is linked from no navigation, is explicitly labeled **PAPER** in its UI, and still runs on the old $1,000 paper balance. It is not part of the live product. **Recommend deleting the narratives docs page entirely** (see Section E). | `Navbar.tsx:21-25` / `MobileNav.tsx:8-12` (no link); `narratives-view.tsx:494-536` (PAPER badge); `packages/api/src/routers/optionsBalance.ts:20` (`STARTING_BALANCE = "1000"`) |
| PO-1 | OUTDATED | Total portfolio value = **Available pUSD cash + market value of open spot positions + market value of open options positions** (the navbar Portfolio pill shows the same sum). No per-platform buying-power components. | `Navbar.tsx:110-114`; `portfolio-view.tsx:157-167` |
| PO-2 | OUTDATED | No single 30-second rule. Refresh is per-panel: balances 15s, spot positions 20s, options positions/history 30s, portfolio chart history 60s (navbar sums refresh every 30s). If docs mention a number, "every 15–60 seconds depending on the panel" is accurate. | `portfolio-view.tsx:131-143`; `Navbar.tsx:79-98` |
| PO-4 | OUTDATED | The chart has a hover/drag cursor: the big value in the card header follows the cursor and a date/time label appears on the chart. There are **no high/low annotations**. Range buttons sit in the card (1D/1W/1M/1Y/ALL). | `apps/web/app/app/portfolio/portfolio-value-chart.tsx`; `portfolio-view.tsx:288-320` |
| DW-1 | OUTDATED | The Portfolio **Balance** card has two buttons: **Deposit** (opens the Wallet modal) and **Withdraw**. There is no Transfer button. | `portfolio-view.tsx:271-284` |
| DW-5 | OUTDATED | Deposit timing: the modal live-tracks the conversion with staged status ("Deposit detected…" → "Finalizing…" → "Converting your deposit to pUSD…"), polling every 5s; first-ever deposit adds a one-time wallet setup (~5–15s). Total is typically well under a couple of minutes. No Solana guidance applies. | `WalletModal.tsx:106-147`; `deposits.ts:192` |
| DW-6 | OUTDATED | **Withdraw is to any external Polygon address** (not to a holding wallet): Withdraw modal → paste a Polygon (0x…) recipient → amount in USDC (MAX button) → confirm. Copy: "Send native USDC to any Polygon address. Gas-free, usually instant." **Minimum $2.** Success screen links the Polygonscan transaction. No Kalshi source selector. | `apps/web/components/portfolio/WithdrawModal.tsx` (`MIN_WITHDRAW = 2`); `deposits.ts:21, 233-295` |
| POS-1 | OUTDATED | Positions live on the **Portfolio page only** (no floating dashboard panel). Under the **positions** tab they're grouped into two sections: **Options** and **Markets** (spot). A **history** tab has filters **All / Options / Spot**. No Narratives tab. | `portfolio-view.tsx:323-353, 382-528` |
| POS-2, POS-3 | OUTDATED | Spot rows are compact cards: market icon + title, "{shares} shares · avg {price} → {price}", current value, and P&L. No Allocation %, no bar, no sum row — aggregate totals live in the Balance card's "In position" cell. | `portfolio-view.tsx:473-528, 266-270` |
| POS-5 | OUTDATED | Options rows show side/strike/qty/avg/mark/days-to-expiry/P&L with three actions: **Buy** (link back to the market), **Sell** (opens an in-page sell ticket), and a **Share** icon (shareable position card). Clicking does **not** open a separate position detail page. | `portfolio-view.tsx:382-471`; `apps/web/components/portfolio/share-card.tsx` |
| POS-8 | OUTDATED | Early close works from the Portfolio row (opens a sell panel) or the market page's **Sell** toggle; proceeds credit your single pUSD **Available** balance (there is no per-platform buying power). Sell minimum: 5 shares. | `portfolio-view.tsx` (TradePanel wiring); `trade-ticket.tsx:126, 237` |
| MKT-4 | OUTDATED | Sports are **not hidden** under "All". Instead, per-game prop listings (events titled "… More Markets" or props without a moneyline game) are filtered out everywhere; moneyline games and futures show normally. | `markets-browse.tsx:89-91` |
| MKT-6, WL-1, WL-2, WL-3, WL-4, WL-5 | REMOVED | The watchlist/starring feature has no UI at all — no star icons, no watchlist row, nothing renders it. (The backend router still exists but nothing calls it.) **Delete the watchlist docs page.** | grep `watchlist` in `apps/web` = zero matches; `packages/api/src/routers/watchlist.ts` (orphaned) |
| MKT-7, MKT-8, MKT-9 | REMOVED | There is no **Daily** tab and no daily-markets view (the 5%–95% filter lived in a legacy router the Spot page doesn't use). | `markets-browse.tsx:35-40` (tabs list); legacy-only logic in `packages/api/src/routers/markets.ts:686-688` |
| MKT-11 | OUTDATED | Card fields: image + title; for binary markets a large **YES % + "chance"** figure (green ≥50%, red <50%) with full-width Yes/No buttons; for multi-outcome, the **top 2 outcomes** each with Yes/No buttons; footer = "{volume} Vol." + time-left or "{n} outcomes". **No 24h-change number on cards** (24h change appears next to each outcome on the market page). | `apps/web/app/app/spot/event-card.tsx:28-49, 357-407` |
| MKT-12 | OUTDATED | Multi-outcome cards show the top **two** outcomes; the market page lists all outcomes (up to 12 for non-sports; sports default to the moneyline with a "Show all N markets" toggle), each expandable inline to its own chart + orderbook. | `event-card.tsx:381-407`; `event-view.tsx:126, 281-366` |
| MKT-13 | OUTDATED | Market page sections: header (volume · timing · outcome count, Share button) → overview price chart (**1D / 1W / 1M / ALL** — no 1Y button) → outcomes list with 24h change and inline expandable chart + **Order book** (7 levels/side, spread row) per outcome → **About** description → **Recent orders** → docked Buy/Sell ticket on the right. "Event siblings" are the outcome rows themselves. | `price-chart.tsx:15` (`RANGES`); `order-book.tsx:6` (`DEPTH = 7`); `event-view.tsx` |
| LB-1, LB-2, LB-4 | OUTDATED | There are now **two leaderboards and no paper mode**. (1) **`/app/leaderboard`** — reached from the trophy icon in the top nav — is a weekly **real-money options competition** ranked by **cumulative notional volume** ("Profit or loss doesn't matter"); rounds run **Friday 12:00 AM → Thursday 11:59 PM EST**; prizes **$100 / $50 / $25 / $5 each for 4th–10th**, paid in pUSD; live countdown; "Rules & Prizes" modal. (2) **`/app/social`** ("Social" — currently linked from no nav) shows a spot-trading leaderboard ranked by P&L/Return plus a live **Activity Feed** of recent spot + options trades. | `apps/web/app/app/leaderboard/leaderboard-view.tsx:148-153, 194-202`; `apps/web/app/app/social/social-view.tsx` |
| LB-3 | UNVERIFIED | The Social page hero still says "Rebates from Kalshi & Polymarket builders programs," but no rebate mechanics exist in code and Kalshi trading isn't live. Confirm with the team whether this program is real before documenting it. | `social-view.tsx:124-140` |
| LB-5, LB-6 | OUTDATED | Social leaderboard columns: **# / Trader / Vol / P&L / Return** — matches the docs. Options leaderboard columns: **# / Trader / Contracts Traded / Volume**, with a top-3 podium. Neither paginates in visible groups of 10; both render a scrollable list (Social fetches 10 rows). | `social-view.tsx:208-214`; `leaderboard-view.tsx:285-290` |
| FAQ-1 | OUTDATED | Still **no explicit platform fee**: spot orders pass through only Polymarket's own market fees (shown as "Est. fee" in the ticket when nonzero), and the options fee hook is set to 0. However, **options quotes include a dealer spread** (about 2% at quiet inventory, rising as a strike's capacity sells out) — that spread is the platform's margin and should be disclosed as "prices include a market-making spread" rather than "no fees." | `packages/shared/src/options/quote.ts:98-102`; `packages/db/src/schema/options.ts:1115` (`fee_bps` default 0); `trade-ticket.tsx:112, 245-253` |
| FAQ-3 | OUTDATED / UNVERIFIED | The app now **geo-blocks trading**: blocked regions see a warning indicator in the nav and tickets read "Viewing only · trading unavailable in your region." The specific jurisdiction list is not in the frontend code, and the Kalshi-eligibility framing no longer applies (Kalshi isn't live). Get the current eligibility list from the team (see Q-8). | `Navbar.tsx:156-167` (`geo.isBlocked`); `trade-ticket.tsx` blocked-state copy |
| FAQ-4 | UNVERIFIED | No cancellation/void-refund handling was found in the codebase — this is exchange-side (Polymarket) behavior. Docs should attribute it to Polymarket rules rather than Theta Labs. | searched `orders.ts`, settlement libs — no void/refund path |
| FAQ-5 | OUTDATED | Deposit timing per DW-5 row. Support channels that actually exist: in-app **Contact** page (message form), email **hello@thetalabs.gg**, X **@thetalabsgg** (x.com/thetalabsgg), Discord **discord.gg/d9gfrYWSAu**. | `apps/web/app/app/contact/page.tsx:119-159` |
| FAQ-6 | OUTDATED | Max-loss story simplifies: spot buyers and options buyers can never lose more than they paid ("The premium you pay is the most you can lose" — in-app copy). The option-seller clause should be **deleted** — users cannot sell/write options. | `market-view.tsx:596-609`; OPT-6 row |
| GLO-1 | WRONG | "Condition ID" is never surfaced in the user-facing app (internal plumbing only). Remove the glossary entry. | grep in `apps/web` UI — internal use only |
| GLO-2 | WRONG | Open interest is not displayed anywhere user-facing (admin panel only). Remove the glossary entry. | only hit: `apps/web/app/app/admin/page.tsx` |
| GLO-3 | UNVERIFIED | Nothing in the codebase states the name origin. Confirm the story with the team before keeping it in public docs. | no code source exists for this (team/brand question) |
| GLO-4 | OUTDATED | "Buying power" as a term is gone — the app calls it **Available** (your pUSD cash). Mechanics match the definition: it decreases when you buy, increases when you sell, redeem, or an option settles in the money. Update vocabulary, keep the mechanics. | `portfolio-view.tsx:266-270`; `WalletModal.tsx:175-180` |

---

## B. Per-page change list

### introduction
- REWRITE: Reposition the product. Lead with **real-money options on prediction markets** (the flagship), then Polymarket spot trading. Remove "aggregates Polymarket and Kalshi" (Polymarket-only today), remove narratives, remove all paper-trading language.
- EDIT: Funding = USDC on Polygon, auto-converted to pUSD (per QS-5/AS-7 corrections). Remove Solana/Kalshi funding.
- REMOVE: "Transfers between platforms" (INT-5), trending/biggest-movers/expiring-soon list names (INT-6), category list (replace per INT-8).
- ADD: One-liner on rewards/referrals and the weekly options competition (Section C).

### quickstart
- EDIT: CTA is **Start Trading** → sign in (email / Google / wallet) → deposit USDC on Polygon (auto-converts to pUSD) → you land on **Options** by default; trade options or switch to **Spot**.
- EDIT: First-trade walkthrough per QS-8 correction (Yes/No → USD or shares → **Buy**; positions on the **Portfolio** page).
- REMOVE: Two-wallet deposit step, Solana instructions, dashboard references.
- ADD: The one-time **"Enable trading"** approval step (Section C-4) — new users hit this before their first deposit converts.

### account-setup
- EDIT: Login methods = email, Google, external wallet (no Apple). Keep embedded-wallet/non-custodial framing (AS-1/2/3 confirmed).
- EDIT: One user-facing wallet story (Polygon); addresses visible in the Wallet modal and on **Profile**.
- REWRITE: Funding section per AS-7 (automatic pUSD conversion, staged status, no Transfer). Remove the Kalshi flow and the buying-power-by-platform breakdown.
- REMOVE: $1,000 paper balance and the Options paper card (AS-10/11).
- ADD: Onboarding step after first sign-in (name, optional phone, quick survey) — see C-11.

### trading/spot-trading
- EDIT: Polymarket-only; settlement credits **pUSD**; keep $0–$1 share mechanics (SPOT-1 confirmed).
- EDIT: Soften "YES + NO always equal $1.00" to approximate/complementary (SPOT-2).
- EDIT: Redemption is **manual from Portfolio** (Redeem button) — fix the SPOT-8 contradiction in favor of the Positions page description, but move the location to Portfolio.
- REMOVE: Source badges (SPOT-5), Kalshi settlement.
- EDIT: Search description per SPOT-4 (navbar search box + Ctrl/⌘+K palette).
- ADD: Order minimums — buy min is max($1, 5×price); sell min 5 shares.

### trading/options-trading
- REWRITE ENTIRELY — this is now the flagship real-money product. Use Section C-1 as the outline: Yes Calls / No Calls, chain columns (Strike/Breakeven/Max return/Ask), multi-leg ticket with payoff chart, buyers-only (no writing), limited capacity ("Sold out"), spread-based pricing, 60-minute TWAP settlement, automatic expiry settlement, sell-to-close from Portfolio, expiry cadences (daily/MWF/weekly/monthly, 8pm ET).
- REMOVE: Everything paper ($1,000 balance), puts, user selling/collateral/yield, Greeks, Bachelier.

### trading/narratives
- DELETE the page. Narratives is archived: unlinked from all navigation, still paper-funded, not part of the live product (NAR row).

### trading/order-types
- KEEP: Market-orders-only (ORD-1), CLOB explanation (ORD-3), options fill instantly vs. the platform dealer (ORD-5), no slippage setting (ORD-6 — optionally mention the automatic 2% protection).
- REMOVE: The Kalshi/Solana orderbook section (ORD-4).
- ADD: Note that a **Limit** option is visible but disabled ("Limit orders coming soon"), and that options capacity is finite (markets can sell out).

### portfolio/overview
- REWRITE around the two hero cards: **Balance** (Available / In position / Total traded + Deposit & Withdraw buttons) and **Portfolio value** (chart, 1D/1W/1M/1Y/ALL, default 1W).
- REMOVE: Sub-accounts table (PO-6), Options paper card (PO-7), the 30-second refresh claim (PO-2), high/low chart annotations (PO-4).
- EDIT: Total value = pUSD cash + open spot value + open options value (PO-1).

### portfolio/deposit-withdraw
- REWRITE: Deposit = Wallet modal (QR + Polygon address, USDC only, auto-converts to pUSD with staged progress). Withdraw = native USDC to **any Polygon address**, min **$2**, gas-free, usually instant, Polygonscan receipt.
- REMOVE: Transfer section (DW-7), Solana tab (DW-4), supported-assets table rows for Kalshi/Solana (DW-8).

### portfolio/positions
- EDIT: Positions live on the Portfolio page under **positions** (sections **Options** and **Markets**) and **history** (All/Options/Spot filters). No floating dashboard panel, no narratives tab, no sum row.
- EDIT: Options row fields per OPT-12/POS-5 (Qty/Avg/Now/Exp, Buy/Sell/Share actions); spot row fields per POS-2.
- EDIT: Redeem flow per SPOT-8/POS-7 (manual green **Redeem** button on the resolved row; pays pUSD).
- ADD: Sell-to-close ticket for options (bid price, realized P&L preview) and position **Share cards**.

### platform/markets
- RENAME the vocabulary: the page is **Spot** (`/app/spot`).
- EDIT: Tabs = Trending / **Hot (default)** / New / Ending soon, with corrected definitions (MKT-2); categories per MKT-3; card anatomy per MKT-11/12; detail page anatomy per MKT-13.
- REMOVE: Source badges, Daily tab section, dashboard curated lists, watchlist star mention, "sports hidden by default."

### platform/watchlist
- DELETE the page. The feature has no UI (WL row).

### platform/leaderboard
- REWRITE as the **weekly options trading competition** at `/app/leaderboard` (trophy icon in nav): ranked by cumulative notional volume, Friday→Thursday EST rounds, prizes $100/$50/$25/$5×7 paid in pUSD, top-3 podium, Rules & Prizes modal.
- EDIT or CUT the Social page material: `/app/social` (spot P&L leaderboard + activity feed) exists but is not linked from navigation — confirm with the team whether it's staying before documenting it. Remove all live-vs-paper toggle content and the builder-rebate claim pending LB-3 verification.

### help/faq
- EDIT: Fees per FAQ-1 (no explicit fee; options prices include a market-making spread; Polymarket market fees pass through and are shown in the ticket).
- EDIT: Eligibility per FAQ-3 (geo-blocking; get the official jurisdiction list — Q-8). Remove Kalshi/CFTC framing.
- EDIT: Support channels per FAQ-5 (in-app Contact page, hello@thetalabs.gg, @thetalabsgg on X, Discord).
- EDIT: Max loss per FAQ-6 (delete the option-seller clause).
- EDIT: Attribute voided-market handling to Polymarket rules (FAQ-4).
- REMOVE: All paper-trading Q&As.

### help/glossary
- REMOVE entries: Condition ID (GLO-1), Open interest (GLO-2), paper trading, Kalshi-on-Solana, USDC.e-as-user-asset, narratives terms, option seller/collateral terms, Greeks (not displayed).
- ADD entries: **pUSD**, **Yes Call / No Call**, **Breakeven**, **Max return**, **TWAP settlement (60-minute average)**, **Available balance**, **Spread (dealer pricing)**, **Sold out / capacity**.
- EDIT: "Buying power" → "Available" (GLO-4); confirm the name-origin story before keeping (GLO-3).

---

## C. New / undocumented features

### C-1. Real-money options (V2) — the flagship product
- **Where in the UI:** **Options** (first nav item; the app's default landing — `/app` redirects here). Market grid → per-market page at `/app/options/[slug]`.
- **What it does:** Buy cash-settled **call options on a market's probability**. A **Yes Call** pays off when the Yes price finishes above your strike; a **No Call** is the same on the No side (this replaces puts). You can never lose more than the premium you pay. Contracts are written by the platform's dealer desk and every contract is fully collateral-backed, so each strike has **limited supply** and can show "Sold out."
- **User flow:**
  1. Open **Options**; each card shows the market, live probability ("{n}% chance"), **Yes Calls** / **No Calls** buttons, expiry count, and "Resolves {date}".
  2. On the market page pick **Yes Call** or **No Call** and an expiry ("Expiring {Mon D} ({n}d)").
  3. The chain lists each strike with **Strike %**, **Breakeven %**, **Max return (x)**, and **Ask (¢)** — tap an ask to add it to the ticket (multi-leg cart; **Contracts / Dollars** toggle).
  4. Review the **payoff-at-expiry chart** (drag the cursor to any settlement level) with **Max profit**, **Max loss**, **Breakeven**.
  5. Click **"Buy for $X"** — fills instantly against the dealer at the quoted ask.
  6. Track the position on **Portfolio** (Qty / Avg / Now / Exp / P&L); close early with **Sell** (fills at the live bid) or hold to expiry.
- **Settlement:** automatic, hourly. Settlement price = the **average of the Yes/No price over the final 60 minutes before expiry** (time-weighted); if the market resolves before expiry, it settles at exactly 0 or 1. Payout per contract = max(settlement − strike, 0), credited in pUSD. In-app explainer: **"How & When This Settles."**
- **Key numbers/limits:** minimum order **1¢ total**; per-strike capacity caps (shown as "{n} available"); optional per-user contract caps on some markets; expiry cadences daily / Mon-Wed-Fri / weekly (Fri) / monthly (3rd Fri) at **8:00 pm ET**, some markets carry an earlier final expiry on resolution day; quotes include a dealer spread (~2% base, higher as capacity depletes); no explicit fee (0 bps at launch).
- **Caveats:** buyers only — writing/selling-to-open is not available ("Selling to close is in your portfolio for now"); no Greeks shown; trading blocked in geo-restricted regions.
- **Suggested docs placement:** full rewrite of `trading/options-trading`; also becomes the lead story in `introduction` and `quickstart`.

### C-2. pUSD balance & automatic deposit conversion
- **Where in the UI:** cash pill in the top nav and **Deposit** on Portfolio → modal titled **"Wallet"**.
- **What it does:** Your single tradeable balance is **pUSD** ("pUSD — your tradeable balance on Polymarket"). Send **USDC on Polygon** to your deposit address (QR + copy button) and it converts automatically — no transfer step, no sub-accounts.
- **User flow:** open the Wallet modal → scan/copy the Polygon address → send USDC → watch staged progress ("Deposit detected…" → "Finalizing…" → "Converting your deposit to pUSD…") → **Available** balance updates.
- **Key numbers/limits:** first deposit includes a one-time wallet setup (~5–15 s); status polls every 5 s; conversion typically completes in well under a couple of minutes; no stated deposit minimum.
- **Caveats:** USDC on Polygon **only** — the modal header warns "⚠ USDC on Polygon."
- **Suggested docs placement:** `account-setup` + `portfolio/deposit-withdraw` (replaces the funding/transfer sections).

### C-3. In-app withdrawals to any Polygon address
- **Where in the UI:** Portfolio → **Withdraw** button → "Withdraw" modal.
- **What it does:** Sends native USDC from your balance to any Polygon address, gas-free, usually instant.
- **User flow:** click **Withdraw** → paste recipient (0x…) → enter amount (or **MAX**) → review "You receive ≈ $X USDC" → confirm → success screen links the Polygonscan transaction.
- **Key numbers/limits:** minimum **$2**; no fee charged by Theta Labs.
- **Suggested docs placement:** `portfolio/deposit-withdraw`.

### C-4. "Enable trading" one-time approval
- **Where in the UI:** shown inside the Wallet modal (and before first trade) until granted.
- **What it does:** A one-time Privy delegation "so Theta Labs can convert your deposits and place trades instantly." Bullets in the UI: "We never hold your keys," "Only works with Polymarket & Kalshi," "Revocable anytime."
- **User flow:** first Wallet-modal open → **Enable trading** → approve in the Privy prompt → deposit QR appears.
- **Suggested docs placement:** a step in `quickstart` and a short section in `account-setup`.

### C-5. Rewards — "Reveal your reward" free shares
- **Where in the UI:** the hero panel on the **Options** page.
- **What it does:** Earn scratch-style reward reveals that pay out **free shares** (a real spot position transferred to your account). Surfaces: **Trade Reward** (first deposit), **Streak Rewards** (3-, 5-, and 7-day trading streaks, with a punch-card tracker), and **Referral Rewards**.
- **User flow:** qualify (e.g., make your first deposit and trade **$1 of options premium** to unlock) → the hero shows "Reveal your reward — Tap to reveal your free shares." → tap to reveal the prize.
- **Key numbers/limits:** reward value distribution: 90% chance of $1–2, 5% of $2–5, 5% of $5–10 (max $10); paid 100% in spot shares.
- **Caveats:** first-deposit reward stays locked until $1 of real options premium is traded.
- **Suggested docs placement:** new page, e.g. **Platform → Rewards & Referrals** (with C-6).

### C-6. Referral program
- **Where in the UI:** referral card in the app (share link `…/r/{code}`); referral links set a cookie that credits the referrer at sign-up.
- **What it does:** "You each get up to **$5 in free shares**" when a referred friend makes their first trade; the card tracks friends joined and amounts earned.
- **User flow:** copy your `/r/{code}` link → friend signs up through it and makes a qualifying trade → both sides receive reward reveals (per C-5 distribution).
- **Suggested docs placement:** same new Rewards & Referrals page.

### C-7. Weekly options leaderboard competition
- **Where in the UI:** trophy icon in the top nav → `/app/leaderboard`.
- **What it does:** A recurring weekly real-money competition ranked by **cumulative notional volume** of options traded ("Profit or loss doesn't matter"). Live countdown to the weekly reset; top-3 podium; your own standing highlighted.
- **Key numbers/limits:** rounds run **Friday 12:00 AM → Thursday 11:59 PM EST**; prizes **1st $100, 2nd $50, 3rd $25, 4th–10th $5 each**, paid in pUSD to the wallet; leaderboard refreshes every 10 s.
- **Suggested docs placement:** rewrite of `platform/leaderboard`.

### C-8. Social page (activity feed + spot leaderboard)
- **Where in the UI:** `/app/social` — currently **not linked from any navigation** (only a leftover survey page links to it).
- **What it does:** "Leaderboards and live activity": a spot-trading leaderboard (# / Trader / Vol / P&L / Return, top-3 medals) and a live **Activity Feed** of recent spot and options trades with Polymarket/Kalshi source badges.
- **Caveats:** nav-orphaned; hero copy still references builder-program rebates (unverified — see LB-3). Confirm the page's future before documenting.
- **Suggested docs placement:** only if the team confirms it stays; otherwise omit.

### C-9. Profile page
- **Where in the UI:** user menu (top-right avatar) → **Profile**.
- **What it does:** Shows your generated avatar, name, email, member-since date; lets you edit **Name** and **Phone**; lists your **Deposit wallet (Polygon)** and **Signing wallet (Polygon)** addresses with copy buttons and Polygonscan links; **Sign out**.
- **Suggested docs placement:** short section in `account-setup`.

### C-10. Contact / support page
- **Where in the UI:** `/app/contact`.
- **What it does:** Support form (message up to 5,000 chars, name/email prefilled) plus channel cards: **EMAIL** hello@thetalabs.gg, **X** @thetalabsgg, **DISCORD** discord.gg/d9gfrYWSAu.
- **Suggested docs placement:** `help/faq` support section + docs footer links.

### C-11. Onboarding at sign-up
- **Where in the UI:** `/login`, step 2 after Privy auth.
- **What it does:** Collects name, optional phone, and quick discovery questions — "Where do you trade today?" (Polymarket / Kalshi / Both / New), trader type, experience, "How'd you hear about us?" Captures referral codes from `/r/{code}` links.
- **Suggested docs placement:** one line in `quickstart`/`account-setup`.

### C-12. Search & command palette
- **Where in the UI:** search box in the top nav ("Search markets…") + **Ctrl/⌘+K** palette ("Search prediction markets...").
- **What it does:** The nav box filters the Spot grid via Polymarket search; the palette title-matches markets (results labeled Kalshi/Polymarket) and jumps to the market page.
- **Suggested docs placement:** `platform/markets` (Spot) page.

### C-13. Smaller items worth a mention
- **Position share cards** — Share icon on options positions generates a shareable P&L card (`share-card.tsx`).
- **Request a market** — dashed tile at the end of the Options grid: "Tell us what you want to trade."
- **Geo-blocking** — restricted regions get a nav indicator and view-only tickets ("Viewing only · trading unavailable in your region").
- **Mobile layout** — bottom tab bar with Options / Spot / Portfolio.
- **How-it-works explainers** — "How it works?" modal on Options; "How & When This Settles" on every options market page. Good source copy for docs tone.

---

## D. Open question answers

**Q-1 (New features):** See Section C. The big five a docs reader must learn about: real-money options (C-1), the pUSD deposit/withdraw flow (C-2/C-3), the Enable-trading approval (C-4), rewards + referrals (C-5/C-6), and the weekly options competition (C-7). No mobile app, no fiat on-ramp, no API keys, no notifications UI (backend notifications exist but nothing renders them — toasts only), no AI features.

**Q-2 (Options status):** **Live options trading has fully launched; paper is decommissioned** (removed 2026-06-11). Funding: the pUSD balance (USDC-on-Polygon deposits auto-convert). Fees: no explicit fee (fee hook set to 0 bps); the platform earns a bid/ask spread built into quotes (~2% base, rising with strike utilization to a cap around 14%). Collateral: users post none (buyers only); every contract is fully backed by dealer collateral, which is why supply is capped per strike. Settlement: automatic hourly cron; settlement price = 60-minute time-weighted average of the underlying price before expiry (exact 0/1 if the market resolved earlier); payoff = max(settlement − strike, 0) per contract, paid in pUSD. Evidence: `packages/api/src/routers/optionsV2.ts`, `packages/api/src/lib/options/settlement.ts`, `packages/shared/src/options/quote.ts`.

**Q-3 (Narratives status):** Still paper ($1,000 virtual balance, `optionsBalance.ts:20`), still technically creatable ("Submit Narrative" button with admin approval), but the feature is **archived**: linked from no navigation, labeled PAPER in its own UI, and explicitly parked per the team's 2026-06-11 decision. **Recommendation: remove the narratives docs page**; do not document creation constraints for a parked feature.

**Q-4 (Renames/moves):** Current top-level navigation (desktop top bar and mobile bottom tabs): **Options · Spot · Portfolio**, plus in the top bar: a **trophy icon → Leaderboard**, a search box, a **cash pill** (opens the Wallet modal), a **portfolio-value pill**, and the **user menu** (Profile / sign out). Key renames for docs vocabulary: "Markets"/"Trade" page → **Spot**; "Dashboard" → gone (`/app` redirects to Options); leaderboard is its **own page**, not under Social; the "Social" page still exists at `/app/social` but is unlinked. Deposit UI is titled **"Wallet"**. "Buying power" → **"Available"**.

**Q-5 (Exchanges):** Polymarket is the only exchange users can trade on today. Kalshi (via DFlow on Solana) remains as backend scaffolding and read-only appearances (Ctrl+K search labels, Social feed badges) but has no deposit path, no trade path, and no balance in the UI. Chain/token change: trading collateral is **pUSD on Polygon** (users deposit native USDC, which auto-converts; USDC.e is only an internal intermediate and never a user-visible asset — the old "USDC.e is what you deposit" guidance is obsolete).

**Q-6 (API):** No public API. The in-app `/app/api-docs` page renders exactly "API — Coming soon" (`apps/web/app/app/api-docs/page.tsx`), and there is no key-management UI. **Delete the Plant Store placeholder spec.**

**Q-7 (Links & branding):** Verified in code: support email **hello@thetalabs.gg**; X **https://x.com/thetalabsgg**; Discord invite **d9gfrYWSAu** (both `discord.com/invite/…` and `discord.gg/…` forms appear). Landing CTA is **"Start Trading."** Not verifiable from code: the app URL (no `app.thetalabs.gg` anywhere in the repo) and the marketing-site URL — confirm with the team. No GitHub link exists in the product; the docs navbar's `github.com/shah625/thetalabs` link doesn't match this repo's git identity — confirm whether any GitHub link should remain (recommend removing it). Note: the landing page's own footer "Docs" link is a dead `href="#"` — the team should point it at the docs site when the refresh ships.

**Q-8 (Compliance wording):** No legal/compliance copy block exists in the codebase. What ships: geo-blocking with the string "Viewing only · trading unavailable in your region", the deposit warning "Only send USDC on the correct network", and options risk copy "The premium you pay is the most you can lose." The old FAQ-3 framing (Kalshi-for-US / Polymarket-not-US) no longer matches the product (Kalshi isn't live) and real-world Polymarket US status has changed — **docs must get current eligibility and risk wording from the team/legal**, not from this audit. Also flag: the public landing page still says "Paper trading is live. Real options launching Q3 2026" (`options-landing.tsx:490`) — stale marketing that contradicts the shipped product and should be fixed alongside the docs.

---

## E. Navigation suggestions

- **DELETE `trading/narratives`** — feature archived, unlinked, paper-funded (Q-3).
- **DELETE `platform/watchlist`** — no watchlist UI exists at all.
- **DELETE `api-reference/openapi.json`** (Plant Store placeholder) — no public API (Q-6).
- **RENAME `platform/markets` → "Spot"** (or retitle the page "Spot markets") to match the app's vocabulary; likewise replace "dashboard" and "buying power" everywhere per Q-4.
- **REWRITE `trading/options-trading`** as the flagship real-money guide and consider moving it first in the Trading group — it's the default landing experience of the app.
- **REWRITE `platform/leaderboard`** around the weekly options competition; drop live-vs-paper framing.
- **ADD a "Rewards & Referrals" page** (Platform group) covering C-5 and C-6 — entirely undocumented today.
- **MERGE `portfolio/deposit-withdraw` content** into a simpler "Deposits & Withdrawals" page reflecting the one-balance pUSD model (no Transfer section).
- **UPDATE the docs.json navbar**: fix or remove the GitHub link (`github.com/shah625/thetalabs` — unconfirmed), and add the real support links (hello@thetalabs.gg, x.com/thetalabsgg, discord.gg/d9gfrYWSAu).
- **HOLD on documenting `/app/social`** until the team confirms it's staying (nav-orphaned today).
