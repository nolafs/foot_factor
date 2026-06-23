# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Commands

```bash
yarn dev              # Start dev server with Turbopack
yarn build            # Production build
yarn check            # Run ESLint + TypeScript check (use before committing)
yarn lint             # ESLint only
yarn lint:fix         # Auto-fix ESLint issues
yarn typecheck        # TypeScript check only
yarn format:write     # Format all files with Prettier
yarn slicemachine     # Start Slice Machine UI on port 9998
```

No test suite is configured.

## Architecture

This is a **Next.js 16 App Router + Prismic CMS** website for a UK podiatry clinic.

### Content Architecture (Prismic)

All page content comes from Prismic (headless CMS). The `src/prismicio.ts` file defines the repository client and 15+ route resolver mappings. Custom type definitions live in `/customtypes/` (26 types: conditions, treatments, services, posts, case_studies, faqs, orthotics, etc.).

Pages are built by fetching a Prismic document and rendering its `slices` array through `<SliceZone>`.

### Slice Machine

Reusable content blocks are managed as "slices" via Prismic Slice Machine. The 18 slices live in `src/slices/` — each has an `index.tsx` component and a `model.json` definition. When adding or modifying slices, run `yarn slicemachine` to use the visual editor.

### Routing

- `src/app/(pages)/[uid]/page.tsx` — generic Prismic page catch-all
- `src/app/conditions/[uid]/page.tsx` — condition detail pages
- `src/app/treatments/[uid]/page.tsx` — treatment detail pages
- `src/app/resources/` — blog posts, guides, case studies
- `src/app/api/` — Algolia indexing, Prismic preview/revalidation endpoints

### Key Integrations

- **Algolia** — search index for conditions, treatments, blog. Admin key server-side only; `NEXT_PUBLIC_ALGOLIA_*` keys for client-side search.
- **Mailersend** — transactional email via server actions in `src/action/`
- **reCAPTCHA** — guards contact/booking forms
- **Google Analytics** — via `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`

### Environment Variables

Validated at build time via `t3-oss/env-nextjs` + Zod. Check `src/env.mjs` for the full schema. Key vars:
- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` — Prismic repo name
- `NEXT_PUBLIC_BASE_URL` — defaults to `https://footfactor.com`
- `ALGOLIA_ADMIN_KEY`, `MAILERSEND_API_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

### Component Structure

- `src/components/ui/` — Radix UI-based primitives (buttons, dialogs, forms, etc.)
- `src/components/features/` — domain-specific components (booking, search, blog, hero, faqs, etc.)
- `src/components/layouts/` — navigation, footer, `RootInnerLayout`
- `src/lib/hooks/` — custom hooks (useParallax, useScrollTop, useMediaQuery, etc.)
- `src/lib/context/` — SearchProvider, BookingProvider (wrap the entire app in `src/app/layout.tsx`)

### Styling

Tailwind CSS with custom design tokens in `tailwind.config.ts`:
- Fonts: Poppins (sans), Exo 2 (heading), PT Serif (accent)
- Custom colors: primary blues + accent golds
- Prettier plugin auto-sorts class names — run `format:write` after editing JSX

### Animations

GSAP and Framer Motion are used throughout. `src/lib/hooks/useTextAnimation.ts` and `useParallax.ts` are the main custom animation hooks.

### Deployment

Netlify (`netlify.toml`). Branches map to release channels via `.releaserc.cjs`:
- `main` → production release
- `staging` → beta
- `development` → alpha

Semantic Release runs automatically via GitHub Actions on push to main/staging.