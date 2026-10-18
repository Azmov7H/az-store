# Technical Refactor Plan — az-store

> Status: **Phases 0–8 executed** on branch `refactor/technical-refactor-plan` (one commit per phase).
> Baselines recorded 2026-10-18. Phase 9 (honesty of dashboard stats) pending owner sign-off.

## Baseline (Phase 0 start)

| Check | Baseline | Now |
|---|---|---|
| `npm run typecheck` | 4 error areas | **0 errors** |
| `npx eslint src` | 21 errors / 2 warnings | **0 / 0** |
| `npx next build` | fails (mango query types; sitemap relative-URL crash) | **green** |

Tooling note: `pnpm run <script>` hangs in this environment; use `npm run` / `npx`.

Stack: Next.js 16 App Router · React 19 · next-intl (en/ar) · Mongoose/MongoDB · shadcn/ui · Tailwind v4.

---

## Phase 0 — tooling (done)
- `package.json`: added `"typecheck": "tsc --noEmit"`.
- Recorded baseline table above.

## Phase 1 — identity convention + i18n + currency (done)
- **Shoes use the custom `id` field (NOT `_id`) everywhere.** `PUT /api/shoes/[id]` → `Shoe.findOneAndUpdate({ id })`; dashboard keys/callbacks use `shoe.id`. `Product` type dropped `_id`; `CartItem` dropped `_id`.
- `/api/logout` POST route added (clears `admin_token`, idempotent).
- Sidebar: `@/i18n/navigation` links, locale-stripped active paths, working logout. Quick actions fixed to `/dashboard/setting`.
- Currency unified to **EGP** (incl. revenue-chart formatter typing).
- i18n keys added to BOTH `messages/en.json` + `messages/ar.json` (validated JSON): `carts`, `Checkout.*`, `LoginPage.*`, `Sidebar.welcome/searchPlaceholder`, `PaymentStep.redirectHint/codInfo/codPay`, `Testimonials.verifiedRole`. Checkout/login no longer hardcode Arabic defaults on the EN locale.

## Phase 2 — security (done)
- Cookie auth: `admin_token` httpOnly cookie (set on login; JWT HS256; `authUtils.isAdminRequest()` accepts Bearer **or** cookie). Middleware (`src/proxy.ts`) + dashboard layout verify.
- Login no longer echoes the JWT in the JSON body.
- Guards added to: `shoes` POST, `shoes/[id]` PUT/DELETE, `orders` GET, `orders/[id]` GET/PUT, `contact` GET. Public: `commits` GET (verified only), `POST` forms, storefront reads.
- **Mass-assignment fix**: `PUT /api/orders/[id]` whitelists fields; totals are server-computed.
- `order-service` rewritten: direct Mongoose, server-side pricing (`calculateShipping` → free from 3 items, else 40 EGP). Client money values ignored.
- Credentials moved to env: `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` (`authUtils` fails closed). `.env.example` added; real dev creds live in gitignored `.env`.

## Phase 3 — dead code (done)
Deleted: `lib/error-handler.ts`, `lib/services/index.ts`, `types/index.ts`, `types/api.ts`, `lib/utils/*` (barrel + cn + validation), `temp_animations.css`, `verify-api.js`, `ui/{progress,sidebar,table,tooltip}.tsx`, `hooks/use-mobile.ts`, dead `app/api/admin/*` analytics routes.
Shared `ORDER_STATUS_COLORS` map (later moved to `constants.ts`). Deps removed: `@vercel/analytics`, `nodemon`. Lint hygiene: `useSyncExternalStore` hydration gates (theme-toggle, cart page), `useMemo` derived filters, typed order cards.

## Phase 4 — service layer (done)
- `product-service.ts` (fetch-through-HTTP) → **`shoe-service.ts`**: direct Mongoose + `toShoeDTO()`; `getShoes/getShoeById` cached (`unstable_cache` 60s, tag `shoes`); CRUD mutators `revalidateTag("shoes","max")` (Next 16 signature).
- Importers re-pointed: shop pages, home `FeaturedProducts`, `sitemap.ts` (kills the `Failed to parse URL` crash → `/sitemap.xml` builds), `stats-service.ts`.
- `commit-service` direct Mongoose (typed `CommitDTO`, verified-only reads, paged + create).
- New `contact-service` (`getContacts` paged + `createContact`).
- All API routes thin: parse/validate/guard → service → unified envelope (`createSuccessResponse/createErrorResponse`). No `mongoose` imports left in `src/app/api/`; no `fetch()` in `src/lib/services/`.
- `Product` DTO carries optional `gender` (round-trips to the edit dialog).

## Phase 5 — Zod (done)
- `src/lib/schemas/`: `order.ts` (products + customer fields; strips client `subtotal/shipping/total`), `shoe.ts` (create schema with defaults **and a separate `shoeUpdateSchema` built from the same shape without defaults — verified that `.partial()` would otherwise silently inject `discount: 0, gender: "unisex"` on every partial PUT**), `contact.ts`, `commit.ts` (coerced rating), `cart.ts` (localStorage salvage parser: drops corrupt lines, caps 50).
- Routes wired: orders POST, shoes POST/PUT, contact POST, commits POST.
- `order-service.createOrder` signature: `Omit<CreateOrderData, "subtotal"|"shipping"|"total">`.
- **Cart provider rewritten** on `useSyncExternalStore` (module store): hydrate/persist happen in mutators/subscribe, not `useEffect`; fixes `react-hooks/set-state-in-effect`. Stock-cap clamps on add/update. `OrderProduct.selectedSize` made optional (matches schema + DB `N/A` fallback).

## Phase 6 — constants (done)
- Revived dead `lib/constants.ts` as single source: `ORDER_STATUSES`, `ORDER_STATUS_COLORS`, `CONTACT_STATUSES`, `SHOE_CATEGORIES/GENDERS/SIZES/COLORS`, `CURRENCY`, `SHIPPING_FEE`, `FREE_SHIPPING_MIN_ITEMS`, `calculateShipping()`.
- Deleted `lib/order-status.ts`; shipping ternary (duplicated ×5: service + cart + 3 checkout steps) now one function; route status lists reuse the constants; `schemas/shoe` imports enums.

## Phase 7 — type safety (done)
- All `any`s eliminated: contact page catch narrowing, `product-edit-dialog` (typed props incl. `CloudinaryUploadWidgetResults`, `ProductEditPayload`, `Product | null`), dashboard `StatsCard` (`LucideIcon`), `dashboard-product-card` (`Product` prop).
- `<img>` preview in the edit dialog kept deliberately with a justified `eslint-disable` (arbitrary admin URLs aren't eligible for `next/image` optimization).

## Phase 8 — server components (done)
- `dashboard/customers/page.tsx`: server component reading `getContacts()` directly (dashboard layout already admin-gates; no client fetch cycle, no skeletons).
- Client island `customers-grid.tsx` keeps search via `useMemo` — **eslint is now 0/0** (both `set-state-in-effect` errors resolved).

## Phase 9 — honesty of dashboard stats (DONE — owner chose: real values only)
Changes on the final commit:
1. `dashboard/page.tsx` — hardcoded trends (`+12.5%`, `+5.2%`, …) and the fake `$` currency sign removed. Revenue shows real total in **EGP**; subtexts now honest (`allTimeTotal` key added en/ar, `processingNow`, `successfullyShipped` kept where accurate).
2. `stats-service.ts` — everything computed from the DB: products = `Shoe.countDocuments()`, customers = distinct emails across orders + verified reviews, brands = actual storefront carousel length (`getBrands().length`), satisfaction = share of verified reviews rated 4+ (avg of ratings → 0–100); **`null` when no verified reviews — and the home Stats widget hides the star card in that case instead of inventing a number**. Removed the "minimum 100" floor.
3. Home `stats.tsx` renders exact counts (`toLocaleString()`), no fake `+` suffixes.

## Follow-ups catalogued (not in scope)
- `i18n/navigation.ts` **adopted** (sidebar) — was slated for deletion; decision: keep.
- Plaintext env password compare (timing-safe) — hashing upgrade candidate (bcrypt/argon2).
- `/api/track` + `AnalyticsSession` remain vestigial (visitor analytics) — revisit when analytics becomes a real feature.
- Arbitrary-image previews use `<img>` (documented exemption above).
- Order `getOrders()` redis fetches capped at 200 — paginate the admin list if orders grow beyond that.

## Rollout / verification
```bash
npm run typecheck   # 0 errors
npm run lint        # 0 problems
npx next build      # green; /sitemap.xml prerenders
```
Deploy notes: set `JWT_SECRET` + `ADMIN_USERNAME` + `ADMIN_PASSWORD` (long random secret; consider argon2/bcrypt hashing later), MongoDB URI. `admin_token` is httpOnly; Bearer header still supported for tooling.

## Residual / follow-ups catalogued
- `i18n/navigation.ts` **adopted** (sidebar) — was slated for deletion; decision: keep.
- Plaintext env password compare (timing-safe) — hashing upgrade candidate.
- `/api/track` + `AnalyticsSession` remain vestigial (visitor analytics) — revisit with Phase 9 decision.
- Arbitrary-image previews use `<img>` (documented exemption above).
