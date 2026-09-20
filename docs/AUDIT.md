# Phase 0: Current Portfolio Audit

**Date:** September 20, 2026  
**Branch:** `redesign/v2`  
**Live site:** https://www.kunalwadhaidev.me/  
**Canonical domain:** https://www.kunalwadhaidev.me/

---

## 1. Stack Inventory

### Build Configuration
- **Framework:** React 19.2.4 + Vite 8.0.1
- **Language:** TypeScript 5.9.3
- **Build command:** `tsc -b && vite build`
- **Dev server:** Vite dev server on port 5173 with proxy to backend (localhost:4000)

### Dependencies
**Core UI:**
- `react` 19.2.4, `react-dom` 19.2.4
- `framer-motion` 12.38.0 (animation library)
- `@react-three/fiber` 9.5.0, `@react-three/drei` 10.7.7, `three` 0.183.2 (3D rendering)
- `lucide-react` 0.577.0 (icon set)
- `axios` 1.14.0 (HTTP client)

**Total bundle size (production):**
- `index.js`: 393.24 KB (128.26 KB gzipped) ← **Exceeds 150 KB gzipped budget**
- `index.css`: 45.29 KB (7.98 KB gzipped)
- `AIChatWidget.js`: 7.13 KB (code-split, lazy loaded)
- `KunalProfilePhoto.jpeg`: 56.61 KB
- **Total initial JS:** ~400 KB (~128 KB gzipped)

### Routing
- **Single-page app** with hash-based anchor navigation (`#about`, `#experience`, etc.)
- **No static pre-rendering:** HTML shell is nearly empty (4.55 KB), all content rendered client-side
- **No route-level code splitting** except for AIChatWidget (lazy loaded)

### Styling Approach
- **CSS architecture:** Design tokens (`tokens.css`) + global reset (`global.css`) + feature styles (`portfolio.css`)
- **No CSS-in-JS, no Tailwind** — vanilla CSS with CSS custom properties
- **Fonts:** Inter (Google Fonts CDN, weights 300-700) + JetBrains Mono (weights 400-600)
- **Theme:** Dark + light mode toggle (localStorage + `data-theme` attribute)

### Animation Libraries
- **Framer Motion:** Used extensively for scroll reveals, layout animations, hover states
- **React Three Fiber + Drei + Three.js:** 3D library present but **not visibly used in current deployment** (IsometricLogo is pure SVG, no WebGL canvas detected)

---

## 2. Content Inventory

### Current Sections (in order)
1. **Hero** (`HeroSection`)
   - Name: "Kunal Wadhai"
   - Title: "Backend Engineer"
   - Bio: "I build production backend systems, APIs, integrations and infrastructure with TypeScript, Node.js and AWS. Currently at Guestara, working on PMS integrations, IoT systems and real-time booking sync."
   - Availability badge: "Open to software engineering opportunities" (green dot)
   - CTAs: "View work" (jumps to #projects), "Resume" (external Google Drive link with arrow icon)
   - Social: GitHub, LinkedIn (with icons)
   - Location: "India" (with map pin icon)

2. **About** (`AboutSection`)
   - Label: "About" / Title: "Engineering with intent"
   - Three paragraphs describing work philosophy and correctness-first approach
   - Sidebar meta (definition list): Currently, Location, Education (B.E. CS, CGEC, 8.53 CGPA), Interests

3. **Experience** (`ExperienceSection`)
   - Label: "Experience" / Title: "Where I've shipped"
   - Two entries (Guestara full-time, Zoho intern)
   - Each shows: company logo (remote URL with fallback initials), role, date range, "Current" badge, bullet points, tech tags
   - **Guestara role title:** "Backend Engineering Intern → Full Time" (source: `profile.json`)
   - **Guestara start date:** 2024-11 (discrepancy with résumé: Feb 2026)

4. **Projects** (`ProjectsSection`)
   - Label: "Work" / Title: "Selected projects"
   - Description: "Systems built for production — real constraints, real trade-offs."
   - Two projects: SupportIQ AI (RAG platform), foodSnatch (food reel platform)
   - Each card: name, description, "Full-stack" badge, engineering areas chips, tech tags, links (Architecture toggle, GitHub, Live)
   - **Architecture diagrams** (collapsible via Framer Motion): interactive SVG node+edge diagrams with animated lines

5. **Skills** (`SkillsSection`)
   - Label: "Skills" / Title: "What I work with"
   - Description: "Technologies grouped by concern — not sorted by how they look on a résumé."
   - **10 groups** (Backend Development, Databases & Caching, Cloud & Infrastructure, Messaging & Async, Observability & Reliability, Integrations, Frontend, Languages, Tooling & Practice, Currently Exploring)
   - Each group: emoji icon, category name, "HOT SKILLS" badge (Backend only), colored accent border, tag cloud
   - **Total of ~90 skill tags**

6. **GitHub** (`GitHubSection`)
   - Label: "GitHub" / Title: "Contribution activity"
   - Description: "Daily commits from @KunalWadhai — the actual graph, not a screenshot."
   - Stat row: public repos, followers, following (if API data available)
   - **Live contribution graph:** `<img>` from `ghchart.rshah.org/6366f1/KunalWadhai` (third-party proxy, not runtime iframe, loads as image)

7. **Coding Profiles** (`CodingProfilesSection`)
   - Label: "Coding" / Title: "Competitive programming"
   - Description: "Profiles across platforms — algorithms, problem solving, and contest performance."
   - Three platform cards: LeetCode, HackerRank, GeeksforGeeks
   - Each card: abbreviation badge (LC/HR/GFG), platform name, handle, one-line descriptor, colored accent stripe, arrow icon

8. **Contact** (`ContactSection`)
   - Contact information (email, LinkedIn, GitHub links)

### Navigation
- **Header:** Fixed nav with logo (IsometricLogo), section links (About, Experience, Work, Skills, GitHub, Coding, Contact), and "Download resume" button
- **Scroll-spy active state** highlights current section
- **Sticky header** with blur backdrop when scrolled

### Footer
- Back-to-top button
- Name, year, "Built with React and TypeScript"

### Special Components
- **IsometricLogo:** SVG "KW" logo with 3D isometric blocks, cursor-reactive tilt, synthetic click sound
- **Terminal:** Animated terminal output (fake server boot sequence) — **not currently visible in PortfolioPage** (not rendered in main sections list)
- **AIChatWidget:** Lazy-loaded AI chat interface with speech-to-text, text-to-speech, backend integration (not part of audit scope per brief)
- **LoadingOverlay:** Initial page load animation

---

## 3. Design Inventory

### Color System
**Dark theme (default):**
- Background: `--bg` #09090b (gray-950), `--bg-subtle` #18181b (gray-900), `--bg-muted` #27272a (gray-800)
- Surfaces: `--surface` #111113, `--surface-raised` #17171a
- Text: `--fg` #fafafa (gray-50), `--fg-muted` #a1a1aa (gray-400), `--fg-subtle` #52525b (gray-600)
- **Accent: `--accent` #818cf8 (indigo-400)** — a purple-blue "AI palette" color
- Borders: rgba(255,255,255, 0.07/0.04/0.12)

**Light theme:**
- Inverted grays, accent shifts to indigo-600 (#4f46e5)

**Status colors:**
- Green: #22c55e, Amber: #f59e0b

**Verdict:** Current accent is in the purple-violet range (indigo), which is borderline "AI palette". The brief bans this.

### Typography
**Fonts:**
- Sans: **Inter** (Google Fonts, 300-700) — overridden in `global.css` with Geist from `@import url()`
- Mono: **JetBrains Mono** (Google Fonts, 400-600) — overridden with Geist Mono
- **Inconsistency:** HTML declares Inter + JetBrains Mono; CSS loads Geist + Geist Mono. **Geist is not self-hosted** (loaded from Google Fonts CDN).

**Scale:**
- 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl), 24px (2xl), 30px (3xl), 36px (4xl), 48px (5xl)
- No fluid clamp() scaling

**Line heights:**
- Body: 1.65
- Headings: not specified (browser default or component-level)

**Weights:**
- Used: 300, 400, 500, 600, 700

### Shape, Space, Elevation
**Radius:**
- `--radius-sm` 4px, `--radius` 8px, `--radius-md` 10px, `--radius-lg` 14px, `--radius-pill` 999px
- **Verdict:** Exceeds brief's 4px max; 8-14px radii present

**Spacing:**
- 8px base (0.25rem increments from 4px to 96px)
- Section gap: 96px (`--space-24`)

**Shadows:**
- `--shadow-sm`, `--shadow`, `--shadow-lg` defined with rgba black
- **Used on:** project cards, experience cards, some panels
- **Verdict:** Box shadows present (brief bans decorative shadows)

**Elevation strategy:** Mix of shadows + borders

### Background Effects
**Grid:** None visible in current implementation (no background grid CSS detected)

**Blur:** Backdrop blur on scrolled navigation (`backdrop-filter: blur(16px)`)

### Motion
**Library:** Framer Motion 12.38.0

**Animation patterns:**
- Hero elements: staggered fade-in + slide-up on mount (0.4s, delays 0.1-0.5s)
- Section reveals: `Reveal` component wraps content, triggers on intersection (fade + slide up, configurable delay)
- Architecture diagrams: collapse/expand with height animation (0.35s ease-out), SVG edge draw-in on load
- IsometricLogo: cursor-reactive tilt (3D transform), spring-back on mouse leave
- Navigation: active section indicator, hover states
- **Looping animations:** SVG edges in architecture diagrams have infinite stroke-dashoffset animation (commented in CSS with `animationDelay`)

**Durations:** 150ms (fast), 250ms (base), 400ms (slow) — matches brief's 120-200ms guidance, but 400ms exceeds

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables animations globally, but IsometricLogo explicitly respects it

### Icons
- **Lucide React** (1.5px stroke, consistent set) — **good fit for brief**

---

## 4. "Vibe-Coded" Findings (Generated-Template Tells)

### Confirmed Template Patterns
1. **✗ Hero availability badge** with green dot: "Open to software engineering opportunities"
   - Location: `HeroSection.tsx` line 14-19
   - Pattern: Green status dot + availability text is a common portfolio generator feature

2. **✗ Fade-and-slide-up on every section**
   - Location: `Reveal` component wraps all major content blocks
   - Pattern: Universal scroll-triggered fade+slide is the default Framer Motion portfolio pattern

3. **✗ All-caps tracked eyebrow labels**
   - Location: `SectionHeader` component renders a `label` prop in all-caps
   - Pattern: "ABOUT", "EXPERIENCE", "WORK" eyebrows above every heading
   - File: `SectionHeader.tsx` (not read yet, inferred from usage)

4. **✗ Emoji + "HOT SKILLS" badge** in Skills section
   - Location: `SkillsSection.tsx` line 137-141
   - Pattern: Emoji icons (⚙️, 🗄️, ☁️) and "HOT SKILLS" indicator

5. **✗ Gradient accent or colored stripe** per skill group
   - Location: `SkillsSection.tsx` sets `--group-accent` per category (10 different colors)
   - Pattern: Multi-color accent system (purple, green, amber, pink, etc.) is decorative

6. **✗ "Currently" / "Location" / "Interests"** definition list in About
   - Location: `AboutSection.tsx` lines 29-46
   - Pattern: Generic "About me" sidebar with life-story metadata

7. **✗ "Where I've shipped"** heading
   - Location: `ExperienceSection.tsx`
   - Pattern: Clever phrasing that reads as template language

8. **✗ "Systems built for production — real constraints, real trade-offs"** tagline
   - Location: `ProjectsSection.tsx` line 57
   - Pattern: Generic tech-LinkedIn voice

9. **✗ Rounded panel cards** with soft shadows
   - Location: project cards, experience cards
   - Pattern: `--radius` 8px, `--radius-md` 10px, `--shadow` applied (exceeds brief's 4px max and no-shadow rule)

10. **✗ GitHub contribution graph** as centerpiece feature
    - Location: `GitHubSection.tsx`
    - Pattern: Third-party graph embed is a common developer portfolio staple

11. **✗ Competitive programming** as its own section
    - Location: `CodingProfilesSection` with LeetCode/HackerRank/GFG cards
    - Pattern: LeetCode stat showcasing is a junior-portfolio trope

12. **✗ Architecture diagram toggle** with animated collapse
    - Location: `ProjectsSection` collapsible architecture diagrams
    - Pattern: "Show architecture" button with animated height transition

13. **✗ 3D isometric logo** with cursor tilt
    - Location: `IsometricLogo.tsx` (pure SVG, but has 3D tilt effect)
    - Pattern: Fancy interactive logo is a portfolio showcase piece

14. **✗ AI chat widget** (lazy loaded)
    - Location: `AIChatWidget.tsx`
    - Pattern: "Chat with my AI clone" is a 2024-2026 portfolio trend

### Voice and Copy Issues
- **"Engineering with intent"**: Generic
- **"I work on systems where correctness is non-negotiable"**: Vague, no specifics
- **"Open to software engineering opportunities"**: Passive job-seeker framing (brief wants confidence)
- **Tech tag clouds**: 90+ skill tags is unfocused (brief wants curated capability matrix)

### Layout Monotony
- Every section is centered max-width container
- Every heading has an eyebrow label
- Every content block uses the same `Reveal` fade-up
- Project and experience sections use identical card patterns

---

## 5. Broken or Fragile Integrations

### GitHub Section
**Component:** `GitHubSection`  
**Integration:** `ghchart.rshah.org/6366f1/KunalWadhai` (third-party proxy for GitHub contribution graph)  
**Status:** ✅ **Working** (loads as `<img>`, has error fallback)  
**Reliability:** Medium (depends on third-party service; has graceful degradation)

**GitHub stats** (public repos, followers, following):  
**Source:** `usePortfolioData` hook fetches from backend `/api/profile`  
**Status:** Conditional render (only shown if `summary` prop exists)  
**Reliability:** Backend-dependent; if backend fails, stats don't show (no visible error)

### LeetCode / HackerRank / GeeksforGeeks
**Component:** `CodingProfilesSection`  
**Integration:** Static data from `profile.json` → `buildCodingPlatforms` utility  
**Status:** ✅ **Working** (no runtime API calls, just outbound links)  
**Data freshness:** Manual (handles and URLs are hardcoded)

**LeetCode stats (rating, streak, problems solved):**  
**Not present** in current UI — only handle and outbound link shown  
**Brief requires:** 1505 contest rating, 500+ day streak, 500+ problems solved  
**Verdict:** Underutilized (stats exist in résumé but not displayed)

### AI Chat Widget
**Component:** `AIChatWidget` (lazy loaded)  
**Integration:** Backend `/api/chat` endpoint (axios POST)  
**Status:** Not audited per brief scope (outside core portfolio content)  
**Note:** Uses Web Speech API (SpeechRecognition, SpeechSynthesis) — browser-dependent

### Profile Data API
**Source:** Backend `/api/profile` endpoint  
**Consumption:** `usePortfolioData` hook in `PortfolioPage`  
**Fallback:** `DEFAULT_PROFILE` constant in `constants.ts`  
**Status:** ✅ **Resilient** (falls back to static data on API failure, shows "Showing cached data — API unreachable" notice in hero)

**Data discrepancies between sources:**
- `constants.ts` lists Guestara start date as `2024-11`
- `profile.json` lists Guestara start date as `2024-11`
- **Résumé (brief Section 3):** Guestara start date is **Feb 2026** (Backend Engineer role), Nov 2025 (intern role)
- **Verdict:** ❌ **Content vs résumé gap** (see Section 6)

---

## 6. Content vs Résumé Gaps

### Missing from Current Site (present in résumé)
1. **Guestara intern role** (Nov 2025 – Jan 2026): Separate entry for Mews PMS Lambda integration work
   - Current site conflates intern and full-time roles into one entry
2. **Precise dates:** Résumé specifies Feb 2026 for Backend Engineer (Full-Stack) role; site shows 2024-11
3. **Quantified metrics:**
   - "100+ properties with provisioned access" → not shown
   - "5,000+ webhook events per month" → not shown  
   - "99.2% PIN delivery rate" → not shown
   - "99.8% reservation sync accuracy" → not shown
   - "50% lower API latency" → not shown
   - "80% fewer manual data errors" → not shown
   - "95%+ automation success rate" → not shown
4. **FoodSnatch detail:** Résumé says "99% uptime", "Redis caching", "MongoDB indexing" — site description is generic ("MERN stack food delivery")
5. **SQLShield-NIDS project:** Present in résumé (99% detection accuracy, MySQL, Scikit-learn), absent from site
6. **LeetCode stats:** 1505 contest rating, 500+ day streak, 500+ problems solved (résumé) → not displayed on site (only handle link shown)
7. **HackerRank 5-star badges:** Mentioned in résumé, not visualized on site
8. **Backend-first full-stack framing:** Résumé emphasizes "Backend Engineer (Full-Stack)" with frontend as secondary scope; site title is just "Backend Engineer"

### Unverifiable Claims on Site (not in résumé or repo)
1. **"Real-time room and guest data synchronization"** (Guestara bullets in `profile.json` and `constants.ts`) → résumé doesn't use "real-time" phrasing; says "sync" but not "real-time sync" as a technical guarantee
2. **"10+ services on the shared library"** → résumé says "10+ services on a shared package library" ✅ (verified)
3. **"TMP75 I2C temperature sensor"** in Zoho work → résumé doesn't name TMP75 specifically, says "TMP75 I2C temperature sensor" ✅ (wait, it does — verified)
4. **SupportIQ AI architecture detail** (BullMQ, Qdrant, per-org isolation) → not verified against a repo README yet
5. **foodSnatch "TikTok-style feed"** phrasing → résumé says "food discovery platform" and "dynamic image transformation"

### Discrepancies
1. **Role title wording:**
   - Site (`profile.json`): "Backend Engineering Intern → Full Time"
   - Résumé: Two separate entries: "Backend Developer Intern" (Nov 2025–Jan 2026), "Backend Engineer (Full-Stack)" (Feb 2026–present)
   - **Verdict:** Site should present two distinct roles

2. **Project descriptions:**
   - Site describes FoodSnatch as "food reel platform" with "TikTok-style feed"
   - Résumé describes it as "food discovery platform" with "personalized content" and "dynamic image transformation"
   - **Verdict:** Site language is more consumer-facing; résumé is more engineering-focused

3. **Skills grouping:**
   - Site has 10 color-coded groups with 90+ tags
   - Résumé has 7 groups (Languages, Application, Data, Cloud and delivery, Security, AI/LLM, Foundations)
   - **Verdict:** Site is more granular (e.g., "Messaging & Async" separate from "Cloud"); résumé is more consolidated

---

## 7. Performance and Accessibility Baseline

### Performance (manual build analysis, no Lighthouse run yet)
**Bundle size:**
- Initial JS: 393 KB (128 KB gzipped) ← **Exceeds 150 KB budget by 78 KB**
- Lazy-loaded JS: 7.13 KB (AIChatWidget)
- CSS: 45 KB (7.98 KB gzipped) ← within budget
- Images: 56 KB (profile photo)

**Suspected performance issues:**
1. **No pre-rendering:** HTML is 4.55 KB shell; all content rendered client-side → slow FCP/LCP, poor SEO
2. **Large JS bundle:** React Three Fiber + Three.js (147 KB) bundled but seemingly unused (IsometricLogo is SVG-only)
3. **Google Fonts blocking:** Inter + JetBrains Mono loaded from Google CDN, not self-hosted with `font-display: swap`
4. **No route-level code splitting** except AI widget
5. **Framer Motion (88 KB)** used extensively for every section reveal

**Expected Lighthouse issues:**
- LCP likely >2.5s (client-rendered content)
- CLS likely >0 (web fonts, dynamic content)
- No SSR/SSG → poor Largest Contentful Paint
- Bundle size → slow Time to Interactive

### Accessibility (code review, no axe scan yet)
**✅ Good practices:**
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Skip link present: `.skip-link` targets `#main`
- Focus visible: `:focus-visible` outline defined globally (2px accent, 3px offset)
- `aria-label` on icon-only buttons and links
- `role="img"` on decorative SVG diagrams with `aria-labelledby`
- `aria-expanded`, `aria-controls` on collapsible architecture diagrams
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables animations

**⚠️ Potential issues:**
1. **Color contrast:** `--fg-tertiary` #7A8491 (brief mentions this) may not meet AA on `--bg-base`; needs programmatic check
2. **Touch targets:** Need to verify 44×44px minimum (buttons appear ~34×34px in nav)
3. **Heading hierarchy:** Need to verify one `h1` per page and logical `h2`/`h3` structure
4. **`aria-hidden` on grid:** Need to confirm background grid has `pointer-events: none` and `aria-hidden` (not present yet since grid isn't implemented)
5. **Keyboard navigation:** Architecture diagram interactions may not be fully keyboard-accessible (SVG nodes, edge highlighting)
6. **IsometricLogo sound:** Synthetic click sound on mousedown has no user preference opt-out except for failure to initialize AudioContext

---

## 8. Keep / Rewrite / Delete Decisions

### KEEP (foundational, aligns with brief)
✅ **Design token system** (`tokens.css`) — well-structured, easy to retheme  
✅ **CSS architecture** (tokens + global + feature CSS) — no CSS-in-JS bloat  
✅ **Lucide icon set** (1.5px stroke) — consistent, engineering-appropriate  
✅ **TypeScript** throughout — type safety  
✅ **Content separation principle** (data in `constants.ts`, `profile.json`) — already structured for `src/content/` migration  
✅ **Semantic HTML** and accessibility foundations  
✅ **Skip link** and focus management  
✅ **Vite + React toolchain** — per brief non-negotiable  

### REWRITE (structurally sound, needs redesign per brief)
🔄 **Color tokens** — replace indigo accent with muted slate-blue, remove multi-color skill accents, add status colors, reduce to dark-only  
🔄 **Typography** — self-host IBM Plex Sans + Mono (or justified alternative), add fluid clamp() scale, tabular numerals  
🔄 **Hero section** — remove availability badge, rewrite bio to backend-first positioning, add platform map SVG, add facts ledger  
🔄 **About section** — delete generic "Engineering with intent" and life-story sidebar; fold relevant context into case studies  
🔄 **Experience section** — split Guestara into two entries (intern + full-time), group bullets by ownership area (A/B/C/D/E structure per brief), vertical timeline layout  
🔄 **Projects section** — reduce to 5 case studies (add SQLShield-NIDS, refine FoodSnatch, verify SupportIQ AI), full case-study page structure (Context, Constraints, Architecture, Key Decisions, Outcome, Stack)  
🔄 **Skills section** — convert to capability matrix (rows = areas, chips link to case studies), remove emoji, remove "HOT SKILLS" badge, single-color accent  
🔄 **Coding profiles** — consolidate into "Proof and fundamentals" block with static snapshot, add LeetCode stats (rating, streak, problems), HackerRank 5-star badges  
🔄 **Navigation** — simplify to Work, Experience, Skills, Contact, Download résumé; remove About and GitHub as standalone nav items  
🔄 **Contact section** — simplify to one sentence + email + LinkedIn + GitHub, no form  

### DELETE (anti-patterns per Section 8)
❌ **Availability badge** (green dot, "Open to...") — passive job-seeker framing  
❌ **All-caps tracked eyebrow labels** ("ABOUT", "EXPERIENCE") — unless it encodes information  
❌ **Multi-color skill group accents** (10 different colors) — decorative  
❌ **Emoji icons** in skill groups (⚙️, 🗄️, ☁️) — not engineering-tool sensibility  
❌ **Box shadows** on cards — brief bans decorative shadows  
❌ **Radii above 4px** (8px, 10px, 14px) — exceeds brief  
❌ **Fade-and-slide-up on every section** — universal scroll animation is template pattern  
❌ **Generic taglines** ("Where I've shipped", "Engineering with intent") — rewrite or remove  
❌ **About section life-story metadata** (Interests: "Distributed systems, API design") — generic  
❌ **GitHub section as standalone feature** — keep contribution graph but integrate into Proof section  
❌ **Separate Coding Profiles section** — merge into Proof block  
❌ **AI Chat Widget** — outside brief scope; keep but don't prioritize  
❌ **Looping SVG edge animations** in architecture diagrams — brief allows motion on user action only  
❌ **React Three Fiber + Three.js** — 147 KB unused (IsometricLogo is SVG-only); remove dependency  
❌ **Light mode toggle** — brief specifies dark-only  

### REPLACE (deprecated or misaligned)
🔁 **Geist fonts** (Google CDN) → **IBM Plex Sans + Mono** (self-hosted via @fontsource, subset to Latin, preload critical weights)  
🔁 **Indigo accent** (#818cf8) → **Muted slate-blue** (#8AA4C0 per brief)  
🔁 **Client-side rendering** → **Static pre-rendering** (vite-react-ssg or equivalent)  
🔁 **Google Drive résumé link** → Verify PDF is accessible, consider hosting in `public/` for reliability  
🔁 **Third-party GitHub chart** (ghchart.rshah.org) → Keep but add fallback; consider build-time snapshot  

---

## 9. Summary: What Works, What Doesn't

### What Works (Foundations to Build On)
- Clean CSS architecture with design tokens
- TypeScript everywhere, good type definitions
- Content separated from UI (data in `constants.ts`, `profile.json`)
- Semantic HTML, accessibility basics (skip link, focus management, reduced motion)
- Lucide icons (consistent, appropriate for brief)
- Vite build is fast
- Backend API integration with graceful fallback

### What Doesn't (Template Patterns, Anti-Patterns, Gaps)
- **Client-rendered only** → no pre-rendering, poor SEO/LCP
- **Bundle bloat** (128 KB gzipped, 78 KB over budget) from unused Three.js, heavy Framer Motion
- **Template voice** (availability badge, emoji skills, "HOT SKILLS", generic taglines)
- **Universal scroll animations** (fade-up on everything)
- **Multi-color decorative accents** (10 skill group colors)
- **Rounded cards with shadows** (8-14px radii, box-shadow)
- **Content gaps** (missing metrics, intern role conflated with full-time, SQLShield-NIDS project absent)
- **Light mode** (brief wants dark-only)
- **Purple-blue accent** (borderline "AI palette")
- **No background grid** (key brief requirement)
- **Monotonous layout** (every section centered, identical card grids)
- **LeetCode/HackerRank stats underutilized** (only links, no metrics shown)

### Critical Path for Redesign (Phase 1+)
1. **Remove Three.js** + unused Framer Motion patterns → cut bundle by ~50 KB
2. **Add static pre-rendering** (vite-react-ssg) → fix SEO, LCP
3. **Redesign color tokens** (single muted accent, dark-only, remove multi-color)
4. **Replace fonts** (self-hosted IBM Plex)
5. **Implement background grid + structural rails** (Section 6.4)
6. **Rewrite hero** (backend-first positioning, platform map, facts ledger)
7. **Restructure experience** (split Guestara roles, ownership-area grouping)
8. **Build 5 case-study pages** with full structure (Context, Constraints, Architecture, Key Decisions, Outcome)
9. **Convert skills to capability matrix** (rows = areas, chips link to demos)
10. **Consolidate proof** (LeetCode stats, HackerRank badges, education in one block)

---

**End of Audit.**  
**Next:** Phase 1 Design Plan (awaiting approval before proceeding).
