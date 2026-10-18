# Frontend Design Refactor & Improvement Plan — az-store

> Status: **Plan approved, execution not started.** Drafted 2026-10-18 from a full frontend audit
> (4 parallel explorations: storefront, dashboard, performance, design tokens + `build` bundle stats).
> Companion doc: `md/technical-refactor-plan.md` (backend/service-layer refactor, phases 0–9 done).
> Branch: `refactor/technical-refactor-plan` — continue here, **one commit per phase (F0–F9)**.

Stack: Next.js 16.4.2 App Router · React 19 · next-intl (en/ar, RTL) · shadcn/ui · Tailwind CSS v4 · Recharts (admin) · Mongoose.

---

## 0. Owner decisions (locked in)

| # | Decision | Choice |
|---|---|---|
| D1 | Shop discoverability UI (search / filters / sort / pagination) | **In scope** — Phase F5 |
| D2 | Admin dashboard polish | **In scope** — Phase F7 |
| D3 | Motion approach | **CSS-only + `motion-safe:` gating** — no framer-motion, ever |
| D4 | Hero asset | **Owner will provide a new image** (current URL is a 404). F0 includes an image slot that now points at a local file, e.g. `public/hero.jpg`; optimized `next/image` treatment in F0 |

Defaults assumed (override anytime): brand name consolidated to **"Ali Store"**, currency **EGP only**, return policy **30 days** (product-card copy is 15 — F5 aligns).

---

## 1. Baseline findings (severity-ranked, all from audit)

### P0 — broken for real users

| Defect | Evidence |
|---|---|
| Hero LCP background → **404 Cloudinary URL** (`Gemini_Generated_Image…`); also the Twitter OG image | `src/components/home/hero.tsx:22`, `[locale]/layout.tsx:86` |
| Hero overlay divs are 0×0 (missing `inset-0` / gradient direction) — intended darkening doesn't exist | `hero.tsx:26-27` |
| `/placeholder.svg` referenced by product cards but **missing from `public/`** | `product-card.tsx:64`, `dashboard-product-card.tsx:33,71` |
| Cart line-item control row overflows/clips at ≤375px (fixed `w-28` image + ~230px of non-wrapping controls) | `(public)/cart/page.tsx:74-86,105-159` |
| Checkout step indicator clips at ≤360px (40px circles + 64px connectors + `gap-16` labels ≈ 300px min) | `(public)/checkout/page.tsx:52-82` |
| Product-edit dialog: `max-w-3xl` merge conflict → 512px at `sm:` while form is 2-col; edge-to-edge on mobile (base `max-w-[calc(100%-2rem)]` dropped by tailwind-merge) | `product-edit-dialog.tsx:169-173`, `ui/dialog.tsx:63` |
| Cairo font **never wins the CSS cascade** (Inter + Cairo classes both on `<html>`, order decides) | `[locale]/layout.tsx:106` |

### P1 — heavy performance debt

| Defect | Evidence |
|---|---|
| First-load JS **780–833KB uncompressed on every public route** (react-dom 223 + router 155 + Zod 105 + Radix 41+30+26+24 + formatjs 39 + lucide/sonner 36 …) | `.next/diagnostics/route-bundle-stats.json` |
| **Zod v4 ships to every client** via CartProvider (105KB) | `providers/cart-provider.tsx:5` → `lib/schemas/cart.ts` |
| **Zero storefront routes prerendered** — AnalyticsTracker `useSearchParams` in root layout w/o Suspense, no `setRequestLocale` anywhere, `getSiteStats` = 5 uncached Mongo queries per home request; `revalidate=60` on shop is dead (reads searchParams) | `AnalyticsTracker.tsx:9`, `[locale]/layout.tsx:103,138`, `stats-service.ts:16`, `shop/page.tsx:13,16-18` |
| Recharts **412KB statically imported** in dashboard; analytics route = 1,089KB JS | 5 chart components, no `dynamic()` |
| Two Google fonts always loaded (10 woff2, 316KB); dead `--font-geist-sans` token; messages 16–21KB + formatjs 39KB serialized to every client | `[locale]/layout.tsx:6-19`, `globals.css:9-10` |
| Image hygiene: AVIF disabled; `sizes` missing on dashboard thumb; logo/testimonial avatars = raw `<img>` via Radix; `priority` on a lazily-opened dialog image | `next.config.mjs:6-16`, `dashboard-product-card.tsx:32`, `logo.tsx:4,11`, `testimonials.tsx:93`, `product-dialog.tsx:68` |
| No `loading.tsx` / `error.tsx` / `not-found.tsx` anywhere; no global `::selection`, no reduced-motion, no Firefox scrollbar styling | repo-wide glob |

### P2 — responsiveness & RTL defects

- **No logical properties and no `rtl:` variants exist in the codebase.** Every physical class below is a real Arabic bug (~30 files): `navbar.tsx:50,65,90` (underline `left-0`, badge `-right-1`, Sheet `side="right"`) · `hero.tsx:53-54` (ArrowRight unflipped) · `testimonials.tsx:51-53,72,100` · `product-card.tsx:73` · `product-add-to-cart.tsx:127,166,212` · `shop/[id]/page.tsx:85,89,110` (ChevronRight unflipped) · `cart/page.tsx:66,148` · `order-summary.tsx:35,47,63` (`text-right` prices) · `login/page.tsx:64-86` (icon `left-3` + `pl-9` misaligns in Arabic) · dashboard `layout-client.tsx:19,26` (drawer slides from **left** in RTL while static sidebar sits right), `app-sidebar.tsx:51,54,92`, `dashboard-header.tsx:68,69,79,83`, `products/page.tsx:116,124,133,143`, `customers-grid.tsx:47,52,57`, `orders/page.tsx:112,116,138` · UI primitives: `ui/sheet.tsx:63-75`, `ui/dialog.tsx:72,90`, `ui/select.tsx:88,93`, `ui/dropdown-menu.tsx:74-133`, `ui/scroll-area.tsx:36` · `Toaster top-right` (`[locale]/layout.tsx:137`). Dashboard lacks a Radix `DirectionProvider` (popper popovers stay LTR).
- Grid inconsistencies: catalog `md:3/lg:4` vs home skeleton `md:4` vs related products `md:4`; `product-card.tsx:63` `sizes` hints wrong for actual column counts; no `xl:` usage anywhere; container widths 7xl/6xl/5xl by area; padding `px-4` vs `px-6` vs `px-6 md:px-12`; dashboard double padding (`main p-4/6/8` + page `p-6`).
- Brands grid text clips at 320px (`text-3xl` in ~150px columns, no truncate).
- Tap targets below 44px: navbar buttons/cart (36), language switcher (32), Sheet nav links (~20), footer links/social (20), color/size chips (36), dialog qty input (~30), dashboard toggles.
- Phone rtl: Toaster, dashboard header divider/ping; no `dir="ltr"` on phone numbers/order IDs.

### P3 — visual comfort / a11y / engagement / i18n

| Area | Findings |
|---|---|
| Contrast (computed WCAG) | white-on-primary **2.80:1** (fails AA), primary-as-text 2.80:1, focus rings **1.69:1** light / 2.49:1 dark (fail 3:1), `--muted-foreground` on `--muted` 4.40:1 |
| Motion | no `prefers-reduced-motion` support at all; infinite loops on home (hero `bgSlide` 60s, `logoBounce`, `buttonPop`, `animate-ping` badge) |
| Focus | zero `focus-visible` outside `ui/*`; two divergent focus recipes (old `ring-2 ring-offset-2` in tabs/slider vs new `ring-[3px]`) |
| Dark mode | holes: footer `text-yellow-400`/`gray-400`, hero white button, low-stock amber badge (no `dark:`), `bg-neutral-*` clashing with stone tokens, `text-[10px]` badges |
| Typography | no type scale (4xl/3xl mixed, `font-black` vs `font-bold` same role); `tracking-tight/wider`/`uppercase` degrade connected Arabic; `italic` on Arabic = synthetic slant; `leading-none` risks with Cairo |
| Engagement | `/shop` has **no search field, no filter chips, no sort, no pagination controls** (data layer already supports category/search/page); no home `<h1>`; no free-shipping progress nudge; footer socials are dead `#` links |
| Copy/trust | brand "Ali Store" (logo) vs "AN Store" (footer) vs "Az Store" (login); emails `alistore` vs `azstore`; `$` in product-dialog vs EGP everywhere else; return policy 15 vs 30 days; "over $50" shipping copy vs 3-item/40EGP rule in `constants.ts` |
| i18n | `Contact` namespace missing entirely (page 100% English); hard-coded strings in home/shop pages, product card/grid/dialog/add-to-cart, cart aria-labels, order summary, login |
| Dashboard | decorative search input (no state); settings tabs with **no content** (Account/Appearance blank); hover-only actions invisible on touch (`dashboard-product-card.tsx:115`, `customers-grid.tsx:93`); dead classes `glass-input` (×11), `shimmer`, `justification-start`, invalid `cubic-bezier`, `text-md`, `perspective-1000`, `animate-fadeIn` no-op; `hsl(var(--card))` chart tooltips = **invalid CSS** (vars are hex) + white default tooltip in dark mode; unused imports (`Skeleton` in analytics, `Cell`, `Legend`) |

---

## 2. Guiding principles

1. **Token-first** — one radius/shadow/spacing/color scale in `@theme`; no one-off `rounded-3xl`, `text-yellow-400`, hex chart colors. Chart/brand exceptions live in tokens (`--chart-1..5`, `--sidebar-*`).
2. **Mobile-first, then scale up** — every layout fixes 320px first; breakpoints override. Test matrix in §8 includes 320/360/375/390/640/768/1024/1280/1440/1536.
3. **RTL-native** — logical utilities (`ms/me/ps/pe/start/end/text-start`) everywhere; physical `left/right/ml/mr/pl/pr` + unflipped icons are bugs. Arabic gets real typography (no tracking/uppercase/italic).
4. **Comfort over decoration** — WCAG AA contrast, visible focus, ≥44px targets, reduced-motion respected. No infinite attention animations.
5. **Measure, don't guess** — every performance change lands with a before/after number from `npx next build` route stats.
6. **Honesty** (carried from technical plan) — no invented stats/copy; trust text matches actual rules in `lib/constants.ts`.

---

## 3. Phase F0 — P0 hotfixes (ship first, one commit)

> Goal: eliminate broken/broken-feeling experiences before any system work. Small, verifiable, no design-system changes.

- [ ] **Hero rebuild** (`hero.tsx`): replace CSS `background-image` (dead URL) with `next/image` (`fill`, `object-cover`, `priority`, `sizes="100vw"`, `fetchPriority`) pointing at owner-provided `public/hero.jpg` (image slot works as soon as the file lands). Fix overlay divs (`inset-0` + real gradient). Remove the 60s `bgSlide` keyframe + related styled-jsx while touching this file (motion policy lands fully in F4).
- [ ] OG/Twitter image → local optimized asset (`[locale]/layout.tsx:73,86`); stop reusing the broken Cloudinary URL.
- [ ] Create `public/placeholder.svg` (soft stone background + centered shoe glyph) so card fallback stops 404ing.
- [ ] Cart line-item mobile overflow: stack controls under the item at `<sm`, let them wrap at `sm` (`cart/page.tsx:105-159`).
- [ ] Checkout stepper: compact responsive stepper (smaller circles, `flex-1` connectors, labels only visible ≥sm or wrap) (`checkout/page.tsx:52-82`).
- [ ] Brands grid: `min-w-0` + responsive text scale so 320px doesn't clip (`brands.tsx:20-28`).

Verify: typecheck/lint/build green; hero renders with owner image; no overflow at 320px on cart/checkout/shop. Commit `fix(ui): F0 P0 hotfixes — hero/og/placeholder/mobile overflow`.

---

## 4. Phase F1 — Foundation: fonts, tokens, containers, dead code

> Goal: one design system. Nothing else in the plan lands cleanly without it.

- [ ] **Fonts (also perf):** per-locale class — `locale === "ar" ? cairo.className : inter.className` (+ `variable` on both configs); wire real `--font-sans`; delete dead Geist tokens (`globals.css:9-10`).
- [ ] **Tokens:** define `--chart-1..5`, `--sidebar-*` (or delete their dead `@theme` mappings), expose `--destructive-foreground`; document the radius chain; add `--header-height` (kills magic `mt-16`/`top-[64px]`/`top-20` numbers in public layout + PDP breadcrumb + sticky summaries).
- [ ] **Radius/shadow semantic scale:** cards `rounded-xl`, controls `rounded-md`, overlays `rounded-lg-to-xl`, pills `full`; replace app-level `rounded-2xl/3xl` one-offs (features, add-to-cart card, PDP image, empty states) with the scale.
- [ ] **Container system:** single `PageContainer` (or documented utility) `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`; unify 6xl/5xl pages; fix dashboard double padding (`layout-client.tsx:38` main padding becomes the only padding).
- [ ] **Section rhythm:** home sections standardize on `py-16 md:py-20` (+testimonials/books exceptions documented); unify grid gaps 6/8.
- [ ] **Dead CSS cleanup:** delete inert `@layer base` block (`globals.css:124-221`, incl. blanket button `transition-all`); define-or-remove `glass-input` (11 usages in `product-edit-dialog.tsx`); remove `shimmer` ref, `animate-fadeIn/animation-delay-*` no-ops, invalid `cubic-bezier`/`justification-start`, `text-md`→`text-base`, `perspective-1000`.
- [ ] Scrollbar: Firefox `scrollbar-color` + less saturated thumb.
- [ ] `components.json`: fix CSS path (`src/app/[locale]/globals.css`) + `"tsx": true`.
- [ ] Regenerate legacy shadcn primitives (`popover`, `tabs`, `slider` — old forwardRef API) to current style; fix duplicated Slider thumb (`slider.tsx:23-24`); unify focus recipe to `ring-[3px] ring-ring/50`.

Verify: tokens compile, no visual regression at 375/1280 light+dark (screenshot pass), dashboard padding uniform. Commit `refactor(ui): F1 design foundation`.

---

## 5. Phase F2 — RTL-native correctness (en + ar parity)

- [ ] Radix `DirectionProvider` in `[locale]/layout.tsx` (next-intl pattern) — fixes popper alignment for select/dropdown/popover in RTL.
- [ ] **Logical-property sweep** across the full inventory in §1/P2 (storefront + dashboard + `ui/sheet/dialog/select/dropdown-menu/scroll-area`); `text-right` prices → `text-end`; `border-r/l` → `border-e/s`.
- [ ] Locale-aware drawer sides: navbar mobile Sheet opens from `end` (server: `side={locale === "ar" ? "left" : "right"}` or logical refactor); dashboard sidebar `start-0` + direction-correct translate + `lg:border-e`.
- [ ] Flip directional glyphs: `ArrowRight`/`ChevronRight`/`→` via `rtl:-rotate-180` wrapper (hero CTAs, PDP breadcrumbs, dashboard widgets' "view all" arrows).
- [ ] `Toaster` position per-direction.
- [ ] `dir="ltr"` islands for numerals/IDs that must read left-to-right in RTL (phone numbers, order IDs, cart totals) (`orders/page.tsx:63,116`, cart prices).
- [ ] **Arabic typography:** drop `tracking-tight/wider`/`uppercase`/`italic` on Arabic-rendering text (or apply only under `:lang(ar)` guard); fix Cairo `leading-none` risks on titles/labels.
- [ ] UI primitives get `rtl:`-safe paddings/indicator sides (select check, dropdown chevron, sheet close).

Verify: manual RTL walk of home/shop/PDP/cart/checkout/dashboard at 375px in `ar`; screenshot pass. Commit `fix(rtl): F2 logical properties + RTL-native shells`.

---

## 6. Phase F3 — Responsive layout repair (320 → 1536)

- [ ] Grid column matrix unification (single canonical catalog grid): catalog `1/2/3/4`, home skeleton + related products + PDP related all match (`shop/[id]/page.tsx:56`, `page.tsx:73`); fix `sizes` hints to match actual columns (`product-card.tsx:63`).
- [ ] Dialog widths: `product-edit-dialog` → `sm:max-w-3xl` (fixes merge), stack Category/Target + Price/Discount rows below `sm`; `product-dialog` keeps gutters on mobile (restore base mobile cap), `max-h/overflow` kept; Popover `w-80` → `w-[min(20rem,calc(100vw-2rem))]` (`product-edit-dialog.tsx:162`, `orders/page.tsx:140`).
- [ ] Tap targets ≥44px sweep: navbar (cart, hamburger, language switcher ≥sm-visible), Sheet nav links (`py-3`), footer links/social inline-flex+padding, color/size chips, replace raw qty `<input>` in `product-dialog` with stepper buttons, dashboard view toggle.
- [ ] Header offset + sticky offsets via `--header-height` (public `mt-16`, PDP `top-[64px]`, summaries `top-20`).
- [ ] PDP spacing: `gap-16` → `gap-8 lg:gap-16`; related `mt-24` → scaled; remove `overflow-hidden` band-aids (footer `:39`).
- [ ] PDP hero image container: `aspect-square` retained, decorative blur `--inset` décor gated by `motion-safe` + `hidden lg:block` for perf/comfort.

Verify: full matrix §8 spot-check (each page at 320/375/768/1280 in en+ar); no horizontal scrollbar anywhere; 44px targets confirmed. Commit `fix(responsive): F3 breakpoint repairs + tap targets`.

---

## 7. Phase F4 — Visual comfort & accessibility

- [ ] **Contrast pass tokens:** light `--primary` darkened one step (orange-600/700 candidate; owner sees side-by-side before commit — brand keeps orange family), `--muted-foreground` ≥4.5 on `--muted`, focus ring ≥3:1 (`ring-ring` at higher alpha + wider ring), manifest theme color aligned with brand.
- [ ] **Focus-visible sweep:** navbar/footer/social/logo links, hero CTAs, chips, qty steppers, image links, breadcrumb links, sidebar nav, dashboard card actions; retire old `ring-offset-2` recipe (tabs/slider done in F1).
- [ ] **Motion policy (D3):** global `@media (prefers-reduced-motion: reduce)` rule; `motion-safe:` on remaining hovers/scales/pulses; remove `logoBounce`/`buttonPop`/`animate-ping` badge loops (hero already reworked in F0); keep `tw-animate-css` Radix transitions.
- [ ] Dark-mode holes → tokens: footer yellows/gray, testimonials gray stars, hero white button, low-stock amber badge `dark:` variant, `neutral-*` → stone, `shadow-white` ink washes.
- [ ] Global comforts: `::selection`, disabled states (`cursor-not-allowed` + token), smoother accordion of spacing in cramped trust-badge rows.
- [ ] **A11y hygiene:** `label htmlFor` in product dialog (color/size/qty), `aria-pressed` on chips, `DialogDescription` on product-edit-dialog (Radix warning), single close affordance in mobile Sheet, real `aria-label`s i18n'd; phone inputs get `inputMode`/`dir` attributes; `<CardTitle as h*>` where headings (login/checkout) + home `<h1>` groundwork (lands in F5).
- [ ] Numeric/i18n rendering: `stats.tsx`/`toLocaleString` uses locale-aware formatting (`useLocale`).
- [ ] — Dashboard-specific a11y ships in F7 (drawer trap, hover-only actions).

Verify: token-diff screenshots light+dark; keyboard-only pass over nav/PDP/cart/checkout; axe devtools clean on home/shop/PDP. Commit `fix(a11y): F4 contrast/focus/motion/comfort`.

---

## 8. Phase F5 — Engagement & conversion (D1)

> Goal: turn discovery gaps into conversion. Copy honesty rules apply.

- [ ] **Shop discoverability UI** (URL-state-driven via existing `searchParams`; server page stays the fetcher):
  - Search input (debounced client island, syncs `?search=`).
  - Category chips from cached `getCategories()` (active state, `?category=`).
  - Sort control: newest / price asc / price desc (`?sort=` — **one tiny service addition**: `getShoes` sort mapping).
  - Real pagination controls driven by the `pagination` meta already returned (Prev/Next + compact numbered).
  - Mobile filter drawer (Sheet) containing search/chips/sort; sticky, aria-labelled.
  - Empty state with CTA → clear-filters action (i18n).
- [ ] **PDP mobile sticky buy bar:** price + Add-to-Cart anchor bar appearing when the price/CTA section scrolls out (`shop/[id]`).
- [ ] **Free-shipping nudge in cart:** progress bar → `FreeItemThreshold = 3` reusing `carts.free_shipping` / `Free` key with remaining-items copy.
- [ ] **Home:** real `<h1>` (wire existing unused `Hero.title` key), translate remaining hard-coded English (Section headings, CTAs, `Loading our best products…`).
- [ ] **Trust/copy consistency sweep:** brand → "Ali Store" everywhere (footer/login), one support email, `$`→EGP in `product-dialog.tsx:83,88`, `ReviewOrder` hard-coded "FREE" → existing `t("free")`, `Total Discount Savings`/`🎉 Free shipping applied!` → keys, return-policy copy aligned (30d chosen — update `product-card` 15d copy), `Features.shipping_desc` matched to the 3-items/40EGP real rule.
- [ ] **Contact i18n:** add `Contact` namespace (info cards, form labels, FAQ accordion) + page reads contact info from a single constants block shared with footer.
- [ ] **Footer:** social links get real URLs or are removed; newsletter/coming-soon affordances removed or made functional (choose: remove dead links).
- [ ] **SEO/debug:** per-route `alternates.canonical` (stop site-wide `"/"`), Product JSON-LD on PDP (name/image/brand/offer/availability), `about` metadata export, verify sitemap covers category-filtered URLs.
- [ ] **Storefront i18n decoder ring:** every hard-coded English string from the dashboard audit checklist gets en+ar keys (card badges "New"/"Out of Stock", "Add to Cart", dialog labels/trust/upsell, cart aria-labels, login placeholder/footer, order summary).

Verify: e2e manual flow — search → filter → sort → paginate → PDP → cart w/ nudge → checkout in en+ar; Lighthouse SEO 100; JSON-LD valid. Commit `feat(engagement): F5 shop discoverability + conversion affordances`.

---

## 9. Phase F6 — Performance optimization

> Goal: budgets in §10. All changes measured via `npx next build` route stats (before/after table in this doc).

- [ ] **Zod off the client critical path:** cart-provider restores via a ~30-line hand-rolled salvage validator (structure check + type coercion + cap 50) — server routes keep Zod (`lib/schemas/*`). Expected −105KB every route.
- [ ] **Static-rendering unlock:**
  - Suspense-wrap (or move route-level) `AnalyticsTracker` — currently blocks prerendering of every route.
  - `setRequestLocale` in `[locale]/layout.tsx` + public pages (next-intl static rendering recipe) + `generateStaticParams` for locales.
  - `getSiteStats` → `unstable_cache` (tag `stats`, revalidate 60) — replicas the `shoes`-tag pattern already in `shoe-service`.
  - Result budget: `/en` + `/ar` (home/about) prerender; shop stays dynamic (searchParams) but with shared cache.
  - Build-time DB resilience: wrap prerendered fetches in try/catch fallbacks (matches current no-whitelist build env), keep sitemap's warned-but-prerendering behavior.
- [ ] **Recharts lazy:** `dynamic(() => import(...), { ssr: false, loading: Skeleton })` for the 5 chart components (or wrap each analytics tab). Expected −412KB on adminRoutes.
- [ ] **Images:** `next.config.mjs` `images.formats: ["image/avif","image/webp"]`; `sizes` on `dashboard-product-card.tsx:32`; logo → `next/image` (remove Radix Avatar with 1024×1024 raw PNG in nav); remove `priority` from lazy `product-dialog.tsx:68`; testimonial avatars left as-is (tiny external), or switched to local initials-only fallback (owner preference noted).
- [ ] **Client diet:** remove `"use client"` from `features.tsx`, `footer.tsx`, `logo.tsx` (hooks-free); hero keyframes to `globals.css` (drop styled-jsx runtime CSS-in-JS).
- [ ] **Route states hygiene:** `loading.tsx` for shop/PDP/cart/checkout (skeleton-first), root `error.tsx` + styled `not-found.tsx`; dashboard `customers/page.tsx` try/catch (currently 500 on DB failure).
- [ ] **i18n payload:** optional subsetting (pass only namespaces per route, or `useMessages` split) — measure first, go if serialization > ~20KB/route.
- [ ] **Misc next.config:** add `"recharts"` to `optimizePackageImports`, drop non-installed `@radix-ui/react-icons` entry.
- [ ] Track `AnalyticsTracker` firing rate — if beacon spam is a concern, batch during initial load (optional micro-task).

Verify: bundle before/after table; Lighthouse mobile runs (home/shop/PDP ≥90 perf, LCP <2.5s); CLS <0.1; `loading.tsx` flows observed. Commit `perf(web): F6 critical-path/static-rendering/bundle`.

---

## 10. Phase F7 — Admin dashboard polish (D2)

- [ ] **Mobile sidebar:** logical position (`start-0`), RTL-correct slide direction + `lg:border-e`, valid easing utility, focus trap + Escape + scroll-lock + `aria-modal` (adopt `ui/sheet` primitive or add Radix Dialog semantics to overlay).
- [ ] **Charts:** one shared tooltip style from tokens (`backgroundColor: var(--card)`, border `var(--border)`, text `var(--card-foreground)`) — kills the `hsl(var(--card))` invalid CSS + dark-mode white tooltip; axis tick `color: var(--muted-foreground)`; mobile chart heights (`h-[220px] sm:h-[300px]`), YAxis width responsive per breakpoint; colors from `--chart-1..5` tokens.
- [ ] **Settings tabs:** remove blank Account/Appearance triggers (or implement swap-able — remove = default), wire real profile form i18n'd.
- [ ] **Hover-only actions on touch** (from audit): `dashboard-product-card.tsx:115`, `customers-grid.tsx:93` → `opacity-100 @[hover:none]`-style (Tailwind v4 has `hover-supported`? use `pointer: fine` via tailwind `pointer:fine:opacity-0 ...` variant or just always-visible at grid card level).
- [ ] **Dead controls/typo classes:** dashboard header search → wire to products page (nav) or remove; `glass-input` handled in F1.
- [ ] **i18n of dashboard chrome:** orders detail popover, settings body, product dialog, analytics card copy, all toasts; sidebar footer year/copyright tokenized (not hard-coded 2024).
- [ ] **Navigation consolidation:** single Link/router policy = `@/i18n/navigation` (low-stock-widget currently `next/link`, header `usePathname`, logout locale-less push).
- [ ] **Analytics page:** wire the imported-but-unused `Skeleton`, i18n error strings, remove duplicate page heading (page title renders twice vs dashboard-header).
- [ ] Orders page: `→` glyph → flipped icon; `pr-1` fixes; Popover width (F3).

Verify: dashboard walk en+ar, mobile drawer keyboard flow, charts legible dark+mobile. Commit `fix(admin): F7 dashboard polish`.

---

## 11. Phase F8 — Verification & guardrails

- [ ] **Manual matrix** (recorded in doc as a checked table): pages `{home, /shop, PDP, /cart, /checkout, /auth/login, /about, /contact}` × widths `{320, 375, 390, 640, 768, 1024, 1280, 1440, 1536}` × `{en, ar}` × `{light, dark}` — full sweep for progressive pages (home/shop/PDP/checkout), spot for inner pages; **zero horizontal scroll** rule.
- [ ] **Bundle stats table:** before/after per route (from `npx next build`) — F6 budget table fills in here.
- [ ] **Lighthouse (mobile, Slow 4G):** home/shop/PDP ≥90 perf, LCP <2.5s, CLS <0.1, TBT <500ms; a11y/SEO/best-practices spot numbers.
- [ ] **Keyboard-only pass:** nav → discovery → PDP → cart → checkout, both locales; focus always visible.
- [ ] **Contrast spot checks:** computed AA on sampled pairs (button text, muted text, focus rings).
- [ ] **RTL screenshot pass** for all F2/F3-touched components in `ar`.
- [ ] Per-phase verification: `npm run typecheck` / `npm run lint` / `npx next build` — all green before each commit (matches technical-plan discipline).
- [ ] Status footer here updated per phase (same convention as technical plan).

---

## 12. Performance budgets (post-F6, enforced in F8)

| Metric | Baseline (2026-10-18) | Budget |
|---|---|---|
| First-load JS public routes (uncompressed) | 779–833KB | **≤ 480KB** (−40%, incl. −105KB Zod) |
| Admin analytics route JS | 1,089KB | **≤ 700KB** (lazy Recharts) |
| Font payload | 10 woff2 / 316KB both locales | ≤ 5 woff2, ≤ ~180KB per locale |
| Prerendered storefront HTML | 0 routes | home + about (en/ar) prerendered |
| LCP (mobile, 4G) | broken hero (404) | < 2.5s |
| CLS | unknown | < 0.1 |
| Lighthouse perf (mobile) | ~unknown | ≥ 90 home/shop/PDP |

---

## 13. Out of scope

- Visual rebrand (palette identity stays orange/stone; F4 token changes are accessibility subtle, not a redesign)
- New backend features (only additions allowed: `getShoes` sort param, `--header-height`, Contact i18n keys)
- PWA, test-framework introduction, framer-motion (D3), component library migrations
- Web-sdk analytics overhaul (vestigial `/api/track`/`AnalyticsSession` stays catalogued as in technical plan)

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Token/radius sweep subtle regressions | screenshot diff pass at 375/1280 per phase (F1/F4) |
| RTL sweep touch surface is broad (~35 files) | checklist in doc per file; dedicated F2 only (no feature mixing); RTL walk after |
| Static prerender depends on DB at build (Atlas IP) | try/catch fallbacks on prerendered fetches; build must pass offline like today's sitemap |
| next-intl static recipe needs care (searchParams pages keep dynamic) | land `setRequestLocale` on static-capable pages only; measure ISR boundaries |
| Hero asset pending from owner | F0 image slot already works with any `public/hero.jpg`; design holds w/ gradient fallback meanwhile |
| Copy honesty vs marketing (return-policy/shipping text) | single source = `lib/constants.ts`; copy derives from rule, never invents |

## 15. Follow-ups (catalogued, undecided)

- Global `font-family` for numeric tabs (mono for money) — nice-to-have
- `@tailwindcss/typography` if long-form content grows (about `prose` classes are currently no-ops — F5 decides: add plugin or drop classes)
- Real analytics feature (visitor sessions) if business wants it — current `/api/track` is vestigial
- Potential `App Router` per-locale sitemap split if catalog > 1000 items
