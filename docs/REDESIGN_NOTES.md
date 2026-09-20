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

## Phase 1: Design Plan (In Progress)
**Status:** Not started — awaiting audit approval

### Planned Deliverables
- `docs/DESIGN_PLAN.md` with:
  1. Refined token system (colors, type scale, spacing)
  2. ASCII wireframes (desktop + mobile) for each section
  3. Information architecture and route map
  4. Diagram inventory (platform map + 5 case-study diagrams)
  5. Self-review against Section 8 blocklist

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
- `docs/REDESIGN_NOTES.md` — this file (running log)

### Modified
- (none yet)

### Deleted
- (none yet)

---

**Next Step:** Present Phase 0 audit to Kunal for review before starting Phase 1.
