# fibbi — market-test storefront (React + Supabase)

A fake-door smoke-test store: everything works, the cart works, checkout ends at a
believable **out of stock** wall that captures restock emails. Every intent signal
is written to Supabase so you can measure real demand before making the product.

## Stack

- Vite + React 18 + react-router-dom
- Supabase (Postgres) — two tables: `leads`, `events`, insert-only RLS
- No backend server needed; deploys as a static SPA (Vercel config included)

## 1 · Supabase setup (5 minutes)

1. Create a project at supabase.com.
2. Open **SQL Editor** → paste and run `supabase/schema.sql`.
3. Go to **Project Settings → API** and copy the *Project URL* and *anon public key*.

The schema creates:

| table | what lands here |
|---|---|
| `leads` | emails — `source` is `restock` (out-of-stock capture) or `waitlist` (home page) |
| `events` | funnel analytics: `page_view`, `add_to_cart`, `checkout_attempt`, `oos_shown`, `quiz_complete`, `pin_check`, `game_score`, `lead_saved` |

RLS allows the public anon key to **insert only** — visitors can never read data.
Each visitor gets a `session_id` (localStorage UUID) so you can compute
per-session funnel conversion. A ready `funnel_daily` view is included.

## 2 · Run locally

```bash
cp .env.example .env        # paste your Supabase URL + anon key
npm install
npm run dev
```

No `.env`? The app still runs — Supabase calls become console no-ops (demo mode).

## 3 · Deploy (Vercel)

```bash
npm i -g vercel && vercel
```

- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project.
- Add `IG_TOKEN` (no `VITE_` prefix) to power the live Instagram strip on the homepage — `api/instagram.js` proxies
  the Graph API so the token never reaches the browser. Token lasts 60 days; refresh it via
  `graph.instagram.com/refresh_access_token`. Leave it unset and the section hides itself.
- `vercel.json` already rewrites all routes to `index.html` (SPA).
- Point a real domain at it before running ads — in-app browsers show the URL bar.

## 4 · Before spending on ads

- [x] **Meta Pixel** — done. Set `VITE_META_PIXEL_ID`; `src/lib/pixel.js` loads it and mirrors
      `AddToCart`, `InitiateCheckout`, `Lead` off the Supabase event stream. No base code in `index.html`.
- [x] **Product photography** — done. `PhotoStack.jsx` renders real shots from `CATALOG[].img`
      (`/public/products/*.webp`). No placeholders remain.
- [x] **Legitimacy signals** — done. FSSAI Lic. `10522999000050` and legal entity **Planstalk LLP**
      now appear in `Footer.jsx`, `TrustStrip.jsx`, `Policies.jsx`, `CartDrawer.jsx`, `Story.jsx`
      and the `Organization` JSON-LD in `index.html`.
- [x] **Fabricated testimonials removed.** `Testimonials.jsx` used invented customer personas with
      made-up delivery and health outcomes — a misleading-advertising risk under India's consumer
      protection rules, and the likeliest reason early visitors called the site untrustworthy. It now
      shows only verifiable proof. `REVIEWS` in `data/catalog.js` is retained but unused; restore a
      carousel only when reviews come from real verified orders.
- Founder section: **deliberately omitted.** City-level location only (Pune, Maharashtra) — full
      registered address is intentionally not published.
- [ ] Optional: third-party lab report backing the 5g fiber claim — strong proof in a category full of
      unverified numbers.

## 5 · Reading the results

The metric that matters: **checkout_attempt / sessions**. On cold Meta traffic,
3–5%+ is a strong buy signal for this category. `add_to_cart / sessions` above
8–10% says the offer works even if checkout intent is thinner. Restock leads are
your launch list — mail them first when batch 001 actually exists.

```sql
-- overall funnel
select * from funnel_daily;

-- which SKUs get added
select payload->>'sku' as sku, count(*) 
from events where event = 'add_to_cart' 
group by 1 order by 2 desc;

-- quiz gap distribution
select payload->>'gap' as gap_g, count(*) 
from events where event = 'quiz_complete' 
group by 1 order by 1::int;
```

## Project map

```
src/
  lib/supabase.js        client + trackEvent/saveLead (safe no-ops without env)
  lib/useReveals.js      scroll-reveal hook
  context/CartContext.jsx  cart state, localStorage persistence, checkout→OOS flow
  data/catalog.js        SKUs, prices, reviews
  components/            layout chrome, cart drawer, quiz, testimonials, game…
  pages/                 Home · Shop · Science · Story · Play · Policies
supabase/schema.sql      tables + RLS + funnel view
```
