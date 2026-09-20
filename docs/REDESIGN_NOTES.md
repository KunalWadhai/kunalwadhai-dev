# Portfolio Redesign v2 — Running Log

## Phase 0: Audit (Complete)
**Date:** September 20, 2026

### Completed
- ✅ Stack inventory (React 19 + Vite 8 + TypeScript 5.9)
- ✅ Content inventory (8 sections, 2 projects, 2 experience entries)
- ✅ Design inventory (Indigo accent, Inter/Geist fonts, 8-14px radii, box shadows)
- ✅ Template pattern identification (14 "vibe-coded" tells found)
- ✅ Integration health check (GitHub chart working, LeetCode stats underutilized)
- ✅ Content vs résumé gap analysis (missing metrics, role conflation, SQLShield-NIDS absent)
- ✅ Bundle size measurement (393 KB JS / 128 KB gzipped — 78 KB over budget)

### Key Findings
1. **No pre-rendering:** 4.55 KB HTML shell, all content client-rendered → poor SEO/LCP
2. **Bundle bloat:** React Three Fiber + Three.js (147 KB) bundled but unused (IsometricLogo is SVG)
3. **Template patterns:** Availability badge, emoji skills, multi-color accents, universal fade-ups
4. **Content gaps:** Guestara intern role missing as separate entry, metrics not displayed, SQLShield-NIDS project absent
5. **Design misalignment:** Indigo accent (purple-blue), 8-14px radii (exceeds 4px max), box shadows (banned)
6. **Light mode:** Present but brief specifies dark-only

### Decisions
**Keep:** CSS token architecture, TypeScript, Lucide icons, Vite toolchain, semantic HTML foundations  
**Rewrite:** Color system, typography (self-host IBM Plex), hero, experience, projects, skills, coding profiles  
**Delete:** Availability badge, emoji, multi-color accents, shadows, radii >4px, fade-ups, light mode, Three.js  
**Replace:** Geist (CDN) → IBM Plex (self-hosted), client-render → static pre-render, indigo → slate-blue

### Output
- `docs/AUDIT.md` — comprehensive audit document

---

## Phase 2: Foundations (Complete)
**Date:** September 20, 2026  
**Status:** Foundations complete — ready for Phase 3 (home page sections)

### Completed
- ✅ Token system (`tokens-v2.css`): dark-only, muted slate-blue accent, fluid type scale, 2-4px radius
- ✅ Global CSS (`global-v2.css`): reset, primitives, 12-col asymmetric grid, utilities
- ✅ IBM Plex Sans + Mono fonts installed (@fontsource, self-hosted)
- ✅ Background grid component (64px grid + structural rails, respects reduced motion)
- ✅ Registration mark component (9×9px "+")
- ✅ Content structure created (`src/content/`):
  - `profile.ts`: Name, headline (option 1), bio, social, resume
  - `facts.ts`: 6 measured outcomes with case-study links
  - `experience.ts`: 3 entries with ownership-area groupings (2 Guestara + Zoho)
  - `case-studies.ts`: 5 complete case studies with fixed structure

### Key Deliverables
**Token system:**
- Colors: `--bg-base` #0F1216, `--accent` #8AA4C0, status colors for diagrams only
- Typography: IBM Plex Sans (400/500/600), IBM Plex Mono (400/600), fluid clamp()
- Spacing: 8px base (4-160px scale)
- Radius: 2px chips, 4px panels (no higher)
- No shadows anywhere

**Content bank (verified against résumé):**
- Experience: Two separate Guestara roles (intern Nov 2025–Jan 2026, full-time Feb 2026–present)
- Facts ledger: 100+ properties, 5,000+ events, 99.2% delivery, 99.8% sync, 10+ services, 50% latency
- Case studies: Smart-lock provisioning, Mews webhook, State machine, Health tracing, Shared library
- Ownership areas: Integration platform, IoT access, Domain modeling, Reliability, Frontend (per brief Section 3)

**TODO markers for confirmation:**
- Frontend scope: BFF layer + React settings-page work (lines marked in `experience.ts`)
- ECB wording: "per vendor API requirements" (used in smart-lock case study)
- 10 of 416 vs 85%: Treated as two separate facts (by count vs by size)

### Output
- `frontend/src/styles/tokens-v2.css` — design token definitions
- `frontend/src/styles/global-v2.css` — reset, primitives, utilities
- `frontend/src/components/layout/BackgroundGrid.tsx` — grid + rails
- `frontend/src/components/layout/RegistrationMark.tsx` — intersection marks
- `frontend/src/content/*.ts` — 4 content files (profile, facts, experience, case-studies)

---

## Phase 1: Design Plan (Complete — Awaiting Approval)
**Date:** September 20, 2026  
**Status:** Design plan complete, awaiting Kunal's approval before Phase 2

### Completed
- ✅ Refined token system (dark-only, muted slate-blue accent, 2-4px radius, no shadows)
- ✅ Typography spec (IBM Plex Sans + Mono, fluid clamp() scale, tabular numerals)
- ✅ ASCII wireframes (hero, work, experience, skills, case-study pages, desktop + mobile)
- ✅ Information architecture (7 routes: home + 5 case studies + 404)
- ✅ Diagram inventory (platform map + 5 case-study flows with interaction specs)
- ✅ Self-review against Section 8 blocklist (13 avoided, 3 scrutinized/justified, 5 refined)

### Key Design Decisions
1. **Asymmetric layout:** 3-col sticky titles + 9-col content (desktop), not centered
2. **Blueprint aesthetic:** 64px grid, structural rails, registration marks, drafting-board feel
3. **Platform map:** Interactive 6-layer system diagram in hero (one draw-in, then still)
4. **Facts ledger:** Definition list of measured outcomes, not gradient cards
5. **Case studies:** Horizontal rows (not cards), 5 standalone pages with fixed structure
6. **Experience:** Vertical timeline with ownership-area disclosures (A/B/C/D/E grouping)
7. **Skills:** Capability matrix with demo-linked chips, not logo cloud
8. **One accent:** Muted slate-blue (#8AA4C0), status colors only in diagrams
9. **Motion policy:** Platform map draw-in (900ms) on load, then stillness

### Output
- `docs/DESIGN_PLAN.md` — comprehensive design specification with wireframes and diagrams

### Awaiting Confirmation Before Phase 2
1. **Headline choice:** Brief offers 3 candidates (Section 2) — which one, or suggest refinement?
2. **Unconfirmed diagram components:**
   - BFF layer (Express, TypeScript, Zod, Axios, AWS Lambda) — confirm scope
   - React settings-page work — confirm scope
   - ECB encryption mode — confirm "per vendor API requirements" wording
   - 10 of 416 vs 85% — confirm these are two separate facts (by count vs by size)
3. **Wireframe feedback:** Any sections that don't match your mental model?

---

## Items Awaiting Confirmation

### Content Verification Needed
1. **Guestara role dates:**
   - Current site: "2024-11 to Present"
   - Résumé: "Nov 2025 – Jan 2026" (intern), "Feb 2026 – present" (full-time)
   - **Confirm correct dates before Phase 3**

2. **10 of 416 records vs 85% payload reduction:**
   - Résumé claims "10 of 416 records per request" AND "~85% smaller per-request payload"
   - By count: 10/416 = 97.6% fewer records
   - By size: 85% lighter payload
   - **These are two separate facts; confirm wording before publishing**

3. **BFF layer and settings-page work:**
   - Résumé mentions "BFF layer (Express, TypeScript, Zod, Axios) deployed serverlessly on AWS" and "React settings-page audit and refactor"
   - **Confirm exact scope and wording before including in case studies**

4. **ECB encryption mode:**
   - Résumé: "AES-256/AES-128, ECB mode, PKCS7 padding"
   - ECB is known to be less secure; if it's dictated by vendor API, say "per vendor API requirements"
   - **Confirm whether to state ECB explicitly and context**

5. **SQLShield-NIDS architecture:**
   - Résumé: "Python, Flask, MySQL, Pandas, Scikit-learn. ML intrusion detection for SQL injection, 99% detection accuracy"
   - **Need to verify repo README to build case-study architecture diagram**

6. **SupportIQ AI per-org isolation:**
   - Site claims "per-org data isolation" but not verified against repo README
   - **Confirm multi-tenancy design before case-study detail**

### Design Decisions Awaiting Approval
- Token system refinements (awaiting Phase 1 plan)
- Platform map architecture (awaiting diagram spec)
- Case-study page structure (awaiting wireframes)

---

## File Changes Log

### Created
- `docs/AUDIT.md` — Phase 0 comprehensive audit
- `docs/DESIGN_PLAN.md` — Phase 1 design specification
- `docs/REDESIGN_NOTES.md` — this file (running log)
- `frontend/src/styles/tokens-v2.css` — design tokens
- `frontend/src/styles/global-v2.css` — global CSS
- `frontend/src/components/layout/BackgroundGrid.tsx` — grid + rails
- `frontend/src/components/layout/RegistrationMark.tsx` — registration marks
- `frontend/src/content/profile.ts` — profile content
- `frontend/src/content/facts.ts` — facts ledger
- `frontend/src/content/experience.ts` — experience timeline
- `frontend/src/content/case-studies.ts` — 5 case studies

### Modified
- (none yet)

### Deleted
- (none yet)

---

**Next Step:** Present Phase 0 audit to Kunal for review before starting Phase 1.
