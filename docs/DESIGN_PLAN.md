# Phase 1: Design Plan

**Date:** September 20, 2026  
**Branch:** `redesign/v2`  
**Status:** Awaiting approval before Phase 2 implementation

---

## 0. Design Principles

This redesign positions Kunal as a **backend-first full-stack engineer** who owns production systems end to end. The visual language is:

1. **Blueprint, not brochure** — structured grid, hairline rules, registration marks, drafting-board precision
2. **Dark, desaturated, low-chroma** — one muted accent, no decorative color
3. **Information-dense** — every pixel earns its place; no filler, no decoration
4. **Quiet confidence** — stillness after one load moment; motion only answers user action
5. **Truth over polish** — every claim traces to résumé or verified fact

**Reference aesthetic:** Linear, Vercel docs, Stripe docs, Railway, Cloudflare engineering blog — not creative agency, not startup landing page.

---

## 1. Token System

### 1.1 Color (Dark-Only, Desaturated)

```css
:root {
  /* ── Surfaces ── */
  --bg-base:      #0F1216;   /* page background */
  --bg-raised:    #151A20;   /* panels, cards */
  --bg-inset:     #0B0E11;   /* code blocks, diagram wells */
  
  /* ── Lines ── */
  --line-faint:   rgba(255,255,255,0.05);  /* background grid (64px) */
  --line-subtle:  rgba(255,255,255,0.09);  /* dividers, panel borders */
  --line-strong:  rgba(255,255,255,0.16);  /* structural rails, focus rings */
  
  /* ── Text ── */
  --text-primary:   #E6E8EB;  /* headlines, body */
  --text-secondary: #9BA3AD;  /* labels, metadata */
  --text-tertiary:  #7A8491;  /* non-essential (verify AA contrast) */
  
  /* ── Accent (single, muted slate-blue) ── */
  --accent:       #8AA4C0;  /* links, primary CTA, active states */
  --accent-hover: #A5BAD1;  /* hover state */
  --accent-wash:  rgba(138,164,192,0.10);  /* subtle backgrounds */
  
  /* ── Status (diagrams + indicators only) ── */
  --ok:   #7FB093;  /* success, healthy */
  --warn: #C8A462;  /* warning, degraded */
  --crit: #C97B7B;  /* error, critical */
  
  /* ── Code ── */
  --code-bg:  rgba(255,255,255,0.04);
  --code-fg:  #C5CBD3;
}
```

**Contrast verification (mandatory before Phase 3):**
- `--text-primary` on `--bg-base`: 13.2:1 ✅
- `--text-secondary` on `--bg-base`: 7.1:1 ✅
- `--text-tertiary` on `--bg-base`: 4.8:1 ⚠️ (verify AA, use sparingly)
- `--accent` on `--bg-base`: 6.9:1 ✅

**Color usage rules:**
1. Accent used ONLY for: links, primary CTA, focus rings, active diagram edges
2. Status colors NEVER appear outside diagrams and status chips
3. No gradients, no glows, no color as decoration
4. Text uses three shades max (primary, secondary, tertiary)

### 1.2 Typography

**Fonts:**
- **Sans:** IBM Plex Sans (400, 500, 600 only)
- **Mono:** IBM Plex Mono (400, 600 only)
- **Source:** `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono` (self-hosted, subset to Latin, preload 400 + 600)
- **Fallback:** `system-ui, -apple-system, sans-serif` with `size-adjust` to match IBM Plex metrics

**Scale (fluid with clamp):**
```css
--text-xs:   clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem);    /* 11-12px */
--text-sm:   clamp(0.8125rem, 0.78rem + 0.17vw, 0.875rem);  /* 13-14px */
--text-base: clamp(0.9375rem, 0.89rem + 0.24vw, 1rem);      /* 15-16px */
--text-md:   clamp(1.0625rem, 1rem + 0.31vw, 1.125rem);     /* 17-18px */
--text-lg:   clamp(1.25rem, 1.15rem + 0.5vw, 1.375rem);     /* 20-22px */
--text-xl:   clamp(1.625rem, 1.45rem + 0.87vw, 1.75rem);    /* 26-28px */
--text-2xl:  clamp(2rem, 1.7rem + 1.5vw, 2.5rem);           /* 32-40px */
--text-3xl:  clamp(2.75rem, 2.2rem + 2.75vw, 3.5rem);       /* 44-56px */
--text-4xl:  clamp(3.5rem, 2.75rem + 3.75vw, 4.5rem);       /* 56-72px */
```

**Type styles:**
```css
/* Headlines */
h1, h2, h3 {
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Body */
body, p {
  font-weight: 400;
  line-height: 1.6;
  max-width: 65ch; /* apply to prose blocks only */
}

/* Labels, metadata */
.label {
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* Mono (identifiers, code, numeric values) */
code, .mono {
  font-family: 'IBM Plex Mono', monospace;
  font-variant-numeric: tabular-nums;
}
```

**Usage:**
- **Headlines:** 600 weight, tight tracking (-0.02em), line-height 1.05–1.15
- **Body:** 400 weight, line-height 1.6, max 65ch measure
- **Labels:** 500 weight, sentence case (NOT all-caps tracked eyebrows everywhere)
- **Numerals:** `font-variant-numeric: tabular-nums` wherever numbers align (facts ledger, metrics)

### 1.3 Shape, Space, Elevation

**Spacing (8px base):**
```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.5rem;   /* 24px */
--space-6:  2rem;     /* 32px */
--space-8:  3rem;     /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
--space-16: 10rem;    /* 160px */
```

**Section rhythm:**
- Desktop: 96–160px between sections (`--space-12` to `--space-16`)
- Mobile: 64–96px between sections (`--space-10` to `--space-12`)

**Radius (rectilinear geometry):**
```css
--radius-sm: 2px;  /* chips, inputs */
--radius:    4px;  /* panels, buttons */
```
**No radius above 4px.** No pill buttons except where semantically appropriate (tags/chips at 2px).

**Elevation (borders + surface color, no shadows):**
```css
/* Panel on --bg-base */
.panel {
  background: var(--bg-raised);
  border: 1px solid var(--line-subtle);
}

/* Inset well (diagram, code block) */
.well {
  background: var(--bg-inset);
  border: 1px solid var(--line-faint);
}

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```
**No box-shadow.** Depth expressed via surface color + border only.

---

## 2. Layout and Information Architecture

### 2.1 Grid and Rails

**Content container:**
```
max-width: 1200px (increased from 1100px to fit 12-column layout)
padding-inline: clamp(1.5rem, 5vw, 3rem)
```

**12-column asymmetric grid (desktop ≥1024px):**
```
[col-1-3: sticky labels] [gap] [col-4-12: content]
      25%                8%            67%
```
Section titles and metadata sit in columns 1-3 (sticky on scroll), content flows in columns 4-12.

**Mobile (<1024px):**
Stack: title above content, no sticky, generous vertical spacing.

**Structural rails (≥1024px only):**
- Two vertical hairlines (`--line-faint`, 1px) at left and right edges of content container
- Run full page height
- Section dividers are full-bleed horizontal hairlines that intersect the rails
- **Registration marks:** 9×9px "+" SVG at rail/divider intersections only (not at every grid cell)

**Background grid:**
- 64px square grid (`--line-faint`)
- Two `linear-gradient` layers (vertical + horizontal)
- Radial `mask-image` fades grid toward edges and bottom of each section
- `pointer-events: none`, `aria-hidden="true"`
- Disabled under `prefers-reduced-motion`

**Hero-only fine grid:**
- 16px sub-grid at half opacity behind platform map SVG only
- Gives drafting-board feel to the system diagram

### 2.2 Routes

**Static pre-rendered pages:**
1. `/` — home (all sections)
2. `/work/smart-lock-provisioning` — case study 1
3. `/work/pms-webhook-ingestion` — case study 2
4. `/work/reservation-state-machine` — case study 3
5. `/work/service-health-tracing` — case study 4
6. `/work/shared-platform-library` — case study 5
7. `/404` — on-brand 404 page

**Optional (if home page gets long):**
- `/experience` — full timeline (standalone)

**Navigation (header):**
- Left: Name (clickable, scrolls to top)
- Right: Work · Experience · Skills · Contact · Download résumé
- Active section: 2px underline in `--accent` (not background fill)
- Mobile: hamburger → drawer (no blur backdrop, solid `--bg-base`)

### 2.3 Section Order (Home Page)

1. **Header** (fixed, 60px tall)
2. **Hero** (platform map + headline + facts ledger)
3. **Selected Work** (5 case studies as horizontal rows, not cards)
4. **Experience** (vertical timeline, newest first)
5. **Skills** (capability matrix)
6. **Other Projects** (compact list rows)
7. **Proof and Fundamentals** (LeetCode, HackerRank, education)
8. **Contact** (email, LinkedIn, GitHub)
9. **Footer** (name, year, tech stack)

---

## 3. Section Wireframes (ASCII)

### 3.1 Hero (Desktop ≥1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [NAME]         Work  Experience  Skills  Contact  [Download résumé] │ ← sticky header
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─[left 6 cols]──────────────────┐  ┌─[right 6 cols]────────────┐ │
│  │                                 │  │                            │ │
│  │  Full-stack engineer with a    │  │   ┌─────────────────────┐ │ │
│  │  backend core.                  │  │   │  [PLATFORM MAP SVG] │ │ │
│  │                                 │  │   │                     │ │ │
│  │  I design, build, and operate  │  │   │  Interactive layers │ │ │
│  │  the systems behind hotel      │  │   │  - Interfaces       │ │ │
│  │  operations, from integrations │  │   │  - BFF/API          │ │ │
│  │  and queues to the interfaces  │  │   │  - Domain services  │ │ │
│  │  staff use every day.          │  │   │  - Integrations     │ │ │
│  │                                 │  │   │  - Data layer       │ │ │
│  │  [View selected work]  [Resume]│  │   │  - Runtime/Ops      │ │ │
│  │                                 │  │   └─────────────────────┘ │ │
│  │  kunalwadhai456@gmail.com      │  │                            │ │
│  │  [GitHub] [LinkedIn]           │  │   (16px fine grid behind  │ │
│  │                                 │  │    SVG for drafting feel) │ │
│  └─────────────────────────────────┘  └────────────────────────────┘ │
│                                                                       │
│  ┌─[facts ledger: full width, 2-col definition list]───────────────┐ │
│  │ 100+ properties     │  5,000+ webhook events/mo                 │ │
│  │ 99.2% PIN delivery  │  99.8% reservation sync                   │ │
│  │ 10+ services        │  50% lower API latency                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile (<1024px):**
```
┌──────────────────────────┐
│ [≡] NAME    [Download ⤓] │
├──────────────────────────┤
│                          │
│  Full-stack engineer     │
│  with a backend core.    │
│                          │
│  [paragraph]             │
│                          │
│  [View selected work]    │
│  [Resume]                │
│                          │
│  kunalwadhai456@gmail.com│
│  [GitHub] [LinkedIn]     │
│                          │
│  ┌────────────────────┐  │
│  │ [PLATFORM MAP SVG] │  │
│  │  (simplified vert) │  │
│  └────────────────────┘  │
│                          │
│  ┌─[facts: stacked]───┐  │
│  │ 100+ properties    │  │
│  │ 5,000+ events/mo   │  │
│  │ 99.2% PIN delivery │  │
│  │ 99.8% sync         │  │
│  │ 10+ services       │  │
│  │ 50% lower latency  │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### 3.2 Selected Work (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [col 1-3: sticky]        [col 4-12: content]                       │
│  ────────────────────────────────────────────────────────────────── │
│  Work                     Selected work                             │
│                                                                      │
│                           ┌──────────────────────────────────────┐  │
│                           │ Multi-provider smart-lock provisioning│  │
│                           │ 100+ properties · 99.2% delivery      │  │
│                           │ [Node.js] [Redis] [Tuya] [Seam]      │  │
│                           │                        [Read case →]  │  │
│                           └──────────────────────────────────────┘  │
│                                                                      │
│                           ┌──────────────────────────────────────┐  │
│                           │ PMS webhook ingestion on serverless  │  │
│                           │ 5,000+ events/mo · zero-downtime     │  │
│                           │ [Lambda] [Serverless] [Mews]         │  │
│                           │                        [Read case →]  │  │
│                           └──────────────────────────────────────┘  │
│                                                                      │
│                           [... 3 more case-study rows ...]          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Rows, not cards.** Each row:
- Title (18px, 600 weight)
- One-line outcome (14px, secondary color)
- Stack chips (2px radius, mono font)
- "Read case study →" link (right-aligned)

**Mobile:** Stack, full width, no sticky title.

### 3.3 Experience (Desktop, Vertical Timeline)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [col 1-3: sticky]        [col 4-12: content]                       │
│  ────────────────────────────────────────────────────────────────── │
│  Experience               Where I've shipped                        │
│                                                                      │
│                           ┌─[rail with dots]───[content]──────────┐ │
│                           │ ●  Feb 2026 – Present                  │ │
│                           │ │  Backend Engineer (Full-Stack)       │ │
│                           │ │  Guestara                            │ │
│                           │ │                                      │ │
│                           │ │  [One-line scope statement]          │ │
│                           │ │                                      │ │
│                           │ │  ▸ Integration platform (PMS)        │ │
│                           │ │    • Built Node.js microservice...  │ │
│                           │ │    • Standardized 20+ endpoints...  │ │
│                           │ │                                      │ │
│                           │ │  ▸ IoT access provisioning           │ │
│                           │ │    • Built multi-provider lock...   │ │
│                           │ │    [collapsible disclosure ▾]       │ │
│                           │ │                                      │ │
│                           │ │  ▸ Domain modeling (collapsed ▸)     │ │
│                           │ │  ▸ Reliability (collapsed ▸)         │ │
│                           │ │  ▸ Frontend (collapsed ▸)            │ │
│                           │ │                                      │ │
│                           │ ●  Nov 2025 – Jan 2026                 │ │
│                           │ │  Backend Developer Intern            │ │
│                           │ │  Guestara                            │ │
│                           │ │  [compact, 3 bullets]                │ │
│                           │ │                                      │ │
│                           │ ●  Jan 2025 – Apr 2025                 │ │
│                           │ │  Embedded Systems Trainee            │ │
│                           │ │  Zoho                                │ │
│                           │ │  [compact, 2 bullets, framed as     │ │
│                           │ │   "hardware to cloud" range signal] │ │
│                           └────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Timeline visual:**
- Vertical hairline rail (1px, `--line-subtle`) with 8px dots at each entry
- "Current" badge (no green dot) next to date range
- Ownership areas (A/B/C/D/E from résumé) as collapsible disclosures
- Newest first (top to bottom)

**Mobile:** Stack, no rail decoration (just date/role/bullets).

### 3.4 Skills (Capability Matrix, Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [col 1-3: sticky]        [col 4-12: content]                       │
│  ────────────────────────────────────────────────────────────────── │
│  Skills                   What I work with                          │
│                                                                      │
│                           ┌────────────────────────────────────────┐│
│                           │ Languages                              ││
│                           │ [JavaScript¹] [TypeScript¹] [Java²]   ││
│                           │ [C++²] [SQL³] [Python²]               ││
│                           ├────────────────────────────────────────┤│
│                           │ Application                            ││
│                           │ [React¹] [Node.js¹] [Express¹] [REST¹]││
│                           │ [microservices¹] [event-driven arch⁴] ││
│                           ├────────────────────────────────────────┤│
│                           │ Data                                   ││
│                           │ [MongoDB¹] [PostgreSQL²] [MySQL²]      ││
│                           │ [Redis¹] [OpenSearch¹]                 ││
│                           ├────────────────────────────────────────┤│
│                           │ [... 4 more rows ...]                  ││
│                           └────────────────────────────────────────┘│
│                                                                      │
│                           Superscripts link to demonstrating        │
│                           case study or project. Chips without      │
│                           a superscript go in quiet "also worked    │
│                           with" line at bottom.                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Rows = capability areas** (from résumé Section 3 grouping):
- Languages
- Application
- Data
- Cloud and delivery
- Security
- AI/LLM
- Foundations

**Each chip:**
- 2px radius, mono font, 12px size
- Clickable superscript (¹²³⁴⁵) jumps to case study anchor
- Hover: `--accent` border

**No emoji. No "HOT SKILLS". No multi-color accents.**

### 3.5 Case-Study Page (Standalone Route)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [NAME]         Work  Experience  Skills  Contact  [Download résumé] │
├─────────────────────────────────────────────────────────────────────┤
│  [col 1-3: meta]          [col 4-12: content]                       │
│  ────────────────────────────────────────────────────────────────── │
│  ← Back to work           Multi-provider smart-lock provisioning    │
│                                                                      │
│  Guestara                 Context                                   │
│  Feb 2026 – Present       Hotel operators needed automated room     │
│                           access provisioning across 100+ properties│
│  Outcome                  without vendor lock-in. [2-3 sentences]   │
│  • 100+ properties                                                  │
│  • 99.2% delivery         Constraints                               │
│  • 60% fewer API calls    • Unreliable vendor APIs (Tuya, Seam)    │
│                           • Timezone edge cases (UTC ↔ local)       │
│  Stack                    • Cold-start overhead on serverless       │
│  [Node.js]                • Encryption/signing per vendor spec      │
│  [Redis]                                                            │
│  [Tuya API]               Architecture                              │
│  [Seam API]               ┌───────────────────────────────────────┐│
│  [Mosler API]             │  [INTERACTIVE SVG FLOW DIAGRAM]       ││
│                           │  Reservation → Policy → Adapter →     ││
│  Next case study          │  Sign/Encrypt → TTL Cache → Vendor →  ││
│  PMS webhook ingestion →  │  PIN Lifecycle → Delivery Status      ││
│                           └───────────────────────────────────────┘│
│                                                                      │
│                           [2-3 sentences describing flow]           │
│                                                                      │
│                           Key decisions                             │
│                           1. Abstraction layer over 3 providers     │
│                              • Alternative: Single-vendor           │
│                              • Reason: Avoid lock-in, uniform API   │
│                           2. TTL-based token caching                │
│                              • Alternative: Request-time auth       │
│                              • Reason: 60% fewer Tuya API calls     │
│                           [... 3 more decisions ...]                │
│                                                                      │
│                           Outcome                                   │
│                           [Definition list of measured results]     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Fixed structure (no variation):**
1. Context (2-3 sentences, business need)
2. Constraints (bulleted list, real technical constraints)
3. Architecture (diagram + description)
4. Key decisions (3-5 items, decision/alternative/reason)
5. Outcome (definition list, measured results from résumé)
6. Stack (chips)
7. Next case study link

**Mobile:** Stack all, meta sidebar becomes header above content.

---

## 4. Diagram Inventory

### 4.1 Platform Map (Hero Section, Interactive)

**Purpose:** The single memorable moment — shows the full system Kunal owns at Guestara.

**Layers (interactive on hover/focus, highlights related tech + jumps to case studies):**

```
┌─────────────────────────────────────────────────────────────┐
│                     [INTERFACES]                            │
│              React operator UI (settings page)              │
├─────────────────────────────────────────────────────────────┤
│                   [API / BFF LAYER]                         │
│        Express · TypeScript · Zod · Axios · AWS Lambda      │
├─────────────────────────────────────────────────────────────┤
│                  [DOMAIN SERVICES]                          │
│   ┌──────────┐  ┌──────────────┐  ┌──────────────────┐    │
│   │ 10+ Node │  │   Shared     │  │  Orchestration   │    │
│   │ Services │←→│   Package    │←→│    Service       │    │
│   │          │  │   Library    │  │ (metadata, sync) │    │
│   └──────────┘  └──────────────┘  └──────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                   [INTEGRATIONS]                            │
│   PMS: Mews · Beds24 · Bifrost · DeathStar                 │
│   Locks: Tuya · Seam · Mosler                              │
│   Payments                                                  │
├─────────────────────────────────────────────────────────────┤
│                    [DATA LAYER]                             │
│         MongoDB · Redis · OpenSearch                        │
├─────────────────────────────────────────────────────────────┤
│                  [RUNTIME & OPS]                            │
│   AWS Lambda · SQS · EC2 · BullMQ · CloudWatch · Teams     │
└─────────────────────────────────────────────────────────────┘
```

**Interaction:**
- Hover/focus on a layer → highlights the related technologies and dims others
- Click layer → smooth scroll + highlight to related case study
- Example: Click "INTEGRATIONS" → scrolls to "Multi-provider smart-lock provisioning" case study

**Visual style:**
- Hand-authored React SVG component
- Horizontal stacked layers (not node-and-edge graph)
- 1px strokes, `--line-strong` borders
- 12px mono labels
- 16px fine background grid (half opacity of main page grid) for drafting-board feel
- **Animation:** Layers draw in top-to-bottom on page load (stroke-dashoffset, 900ms total), then still

**Accessibility:**
- `role="img"` with `aria-labelledby` title + description
- Visually hidden ordered list narrating layers top-to-bottom
- Keyboard: Tab through layers, Enter/Space to jump to case study
- Reduced motion: No draw-in animation, instant render

**Unconfirmed components (mark for Kunal's review):**
- "BFF layer" — résumé mentions it; confirm exact scope before publishing
- "Settings page" in React UI — résumé mentions "React settings-page audit and refactor"; confirm scope

### 4.2 Case Study 1: Multi-Provider Smart-Lock Provisioning

**Flow diagram (horizontal left-to-right):**

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Reservation  │───→│ Access Policy│───→│   Provider   │
│    Event     │    │ (room, time, │    │   Adapter    │
│              │    │   timezone)  │    │  Interface   │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                           ┌───────────────────┴──────────────┐
                           ↓                                   ↓
                    ┌──────────────┐                   ┌──────────────┐
                    │ Sign/Encrypt │                   │  TTL Cache   │
                    │ (AES, HMAC)  │                   │   (tokens)   │
                    └──────┬───────┘                   └──────┬───────┘
                           │                                  │
                           └─────────→ ┌──────────────┐ ←────┘
                                       │  Vendor API  │
                                       │(Tuya/Seam/   │
                                       │   Mosler)    │
                                       └──────┬───────┘
                                              ↓
                                       ┌──────────────┐
                                       │ PIN Lifecycle│
                                       │ CRUD + status│
                                       └──────────────┘
```

**Interactions:**
- Hover node → highlights connected edges (stroke-dasharray animation)
- Click "Sign/Encrypt" → shows tooltip: "AES-256/128, HMAC-SHA256 per vendor API requirements"
- Click "TTL Cache" → shows tooltip: "60% fewer Tuya API calls"

**Outcomes (below diagram):**
- 100+ properties with provisioned access
- 99.2% PIN delivery rate
- 60% fewer Tuya API calls (via TTL cache)

**Confirm with Kunal:**
- ECB mode wording: "per vendor API requirements" (if ECB is vendor-mandated)

### 4.3 Case Study 2: PMS Webhook Ingestion on Serverless (Mews)

**Flow diagram:**

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Provider     │───→│    Lambda    │───→│  Middleware  │
│  Webhook     │    │   Handler    │    │   Pipeline   │
│   (POST)     │    │ (dual-mode:  │    │ • Joi valid  │
└──────────────┘    │  Lambda +    │    │ • Dedup      │
                    │  Express)    │    │ • Response   │
                    └──────────────┘    └──────┬───────┘
                                               │
                          ┌────────────────────┴────────────────┐
                          ↓                                     ↓
                   ┌──────────────┐                     ┌──────────────┐
                   │  Ephemeral   │                     │  OpenSearch  │
                   │  Mongoose    │                     │    Index     │
                   │  Connection  │                     │              │
                   └──────┬───────┘                     └──────────────┘
                          ↓
                   ┌──────────────┐
                   │   MongoDB    │
                   │ Persistence  │
                   └──────────────┘
```

**Annotations:**
- "Batch dedup: ≤100 events/POST, 6 event types, providerRefId key"
- "Dual-mode: `serverless deploy` (Lambda) + `node server.js` (local Express)"

**Outcomes:**
- 5,000+ monthly webhook events
- Zero-downtime releases (CI/CD: Serverless Framework)

### 4.4 Case Study 3: Reservation State Machine + Booking Normalization

**Interactive state diagram (4 states, transitions on hover):**

```
   ┌─────────────┐
   │  Confirmed  │
   └──────┬──────┘
          │ (check-in window opens)
          ↓
   ┌─────────────┐
   │ Pre-Checkin │
   └──────┬──────┘
          │ (guest arrives)
          ↓
   ┌─────────────┐
   │  Checkin    │────→ (cancel) ───→ ┌───────────┐
   └──────┬──────┘                     │ Canceled  │
          │ (checkout time)            └───────────┘
          ↓
   ┌─────────────┐
   │  Checkout   │
   └─────────────┘
```

**Interaction:**
- Click state → shows guard conditions (timezone logic, SINGLE vs GROUP classification)
- Side panel: 3 API sources → normalized booking object (1-hour TTL cache)

**Outcomes:**
- 99.8% reservation sync accuracy
- 70% fewer redundant API calls (via 1-hour TTL cache)

**Confirm with Kunal:**
- Cancel transition: "Mark cancel-transition edges for confirmation" (brief notes uncertainty)

### 4.5 Case Study 4: Service Health Tracing + Alerting

**Flow diagram:**

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Services   │───→│ Redis 15-min │───→│ Ratio vs     │
│ (emit events)│    │   Sliding    │    │ Warn/Crit    │
│ success/fail │    │   Window     │    │ Thresholds   │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                          ┌────────────────────┴────────────────┐
                          ↓                                     ↓
                   ┌──────────────┐                     ┌──────────────┐
                   │    Teams     │                     │  CloudWatch  │
                   │    Alert     │                     │  Dashboards  │
                   │ (diagnostics)│                     │              │
                   └──────────────┘                     └──────────────┘
```

**Optional interactive simulator:**
- Slider: failure rate 0-100%
- Real-time visualization of ok/warn/critical state
- Label: "Illustrative thresholds only — not production values"

**Outcome:**
- Reduced manual monitoring overhead across production pipelines (no invented numbers)

### 4.6 Case Study 5: Shared Platform Library + Integration Orchestration

**Diagram (center: shared library, spokes: consuming services):**

```
                    ┌──────────────────────┐
                    │  Central Orchestration│
                    │  Service (property   │
                    │  metadata, booking   │
                    │  sync, inventory,    │
                    │  OpenSearch index)   │
                    └──────────┬───────────┘
                               │
                               ↓
            ┌──────────────────────────────────────┐
            │     Shared Package Library           │
            │  (schemas, utilities, models)        │
            └──┬───────┬────────┬────────┬─────┬───┘
               │       │        │        │     │
         ┌─────┴──┐ ┌──┴───┐ ┌─┴────┐ ┌─┴───┐ │ [... 6 more services]
         │Service1│ │Svc 2│ │Svc 3│ │Svc 4│ │
         └────────┘ └─────┘ └──────┘ └─────┘ │
                                               │
                    "10+ services consume library"
```

**Sub-section (same page):** Frontend data-fetching work
- Small "try it" mock: infinite-scroll selector with fake data (10 records, cursor pagination demo)
- Annotation: "10 records per request (down from 416), <150ms API response, ~85% lighter payload"

**Outcomes:**
- 20+ integrations standardized
- 80% fewer manual data errors
- 95%+ automation success rate
- 50% lower API latency (connection pooling + Redis caching)

**Confirm with Kunal:**
- "10 of 416 vs 85%": Two separate facts (by count vs by size); confirm wording

---

## 5. Self-Review Against Section 8 Blocklist

I reviewed the design plan against the brief's anti-patterns (Section 8). Here's what I found and how I addressed it:

### ✅ AVOIDED (No Template Patterns)
1. **No gradient text, borders, washes, glows, glassmorphism** — Single muted accent, flat surfaces
2. **No 3D spinning objects, particles, floating icons** — Platform map is static SVG (draw-in once, then still)
3. **No typewriter text, waving emoji, scroll-jacking** — Sentence case, plain copy, smooth scroll only on user action
4. **No skill progress bars or percentage ratings** — Capability matrix with linked chips
5. **No logo marquees or icon walls** — Stack chips in small groups under each case study
6. **No grid of identical rounded cards** — Horizontal rows for work, vertical timeline for experience, definition lists for facts
7. **No hover lift on everything** — Hover states only on interactive elements (links, buttons, diagram nodes)
8. **No all-caps tracked eyebrows everywhere** — Labels only where they encode information (date ranges, status)
9. **No "01 / 02 / 03" numbering** — Timeline uses dates, case studies use descriptive titles
10. **No accenting a single word per headline** — Plain text, no color/italic mid-sentence
11. **No Lorem ipsum, fake metrics, buzzword copy** — Every fact traces to résumé
12. **No radius above 4px** — 2px chips, 4px panels
13. **No decorative shadows** — Elevation via borders + surface color only

### ⚠️ SCRUTINIZED (Potential Template Overlap, Justified)
1. **Platform map with interactive layers** — This is NOT a decorative 3D animation; it's a functional system diagram that explains architecture. Interaction serves navigation (jump to case studies). Animation is one draw-in on load (900ms), then still. **Justified:** Core brief requirement (Section 7.2), directly supports "owns systems end to end" positioning.

2. **Collapsible disclosures in experience** — Could read as "show/hide detail" UI pattern, but this is semantic: grouping bullets by ownership area (A/B/C/D/E) as specified in brief Section 3. **Justified:** Makes full-stack ownership legible without overwhelming the timeline.

3. **Facts ledger in hero** — Large numbers in a grid could read as "metric showcase", but these are: (a) real measured outcomes from résumé, (b) presented as plain definition list (not gradient cards), (c) linked to case studies. **Justified:** Brief requires these metrics to be visible and prominent (Section 7.2).

4. **"View selected work" CTA** — Could read as generic, but it's literal: "view" (not "explore" or "check out") and "selected work" (5 case studies, curated). **Justified:** Plain language, describes what happens.

### 🔍 AREAS THAT LOOKED TEMPLATE-Y, THEN REFINED
1. **Original impulse:** "Welcome to my portfolio" or "Hi, I'm Kunal" → **Revised to:** Headline candidates from brief (Section 2), no greeting.
2. **Original impulse:** Three-column feature grid for skills → **Revised to:** Capability matrix (rows = areas, chips = tech, links to demos).
3. **Original impulse:** Project cards with "View project" buttons → **Revised to:** Horizontal rows with "Read case study →" links.
4. **Original impulse:** "About me" narrative → **Deleted:** No standalone about section; context lives in case studies.
5. **Original impulse:** Separate GitHub and Coding sections → **Revised to:** Consolidated "Proof and fundamentals" block.

### 🎯 DESIGN UNIQUENESS (What Makes This NOT Generic)
1. **Asymmetric two-column layout** (3-col sticky titles, 9-col content) — not centered-everything
2. **Structural rails + registration marks** — blueprint/drafting-board aesthetic, not "tech grid wallpaper"
3. **Facts ledger as definition list** — not big gradient numbers
4. **Case studies as horizontal rows** — not card grid
5. **Vertical timeline with ownership-area groupings** — not flat bullet list
6. **Capability matrix with demo links** — not logo cloud
7. **One load moment (platform map draw-in), then stillness** — not looping animations everywhere
8. **Dark-only, single muted accent** — not multi-color, not purple-AI-palette
9. **Rectilinear geometry (2-4px radius, no shadows)** — not rounded soft cards
10. **Backend-first positioning with platform map** — not generic "full-stack developer"

### ✅ VERDICT
This plan does NOT produce the default portfolio I'd generate for any developer. It's tailored to position Kunal as a backend-first full-stack engineer who owns production systems, with a blueprint aesthetic that supports the "engineering drawing" visual language.

---

## 6. Next Steps (Awaiting Approval)

**Before proceeding to Phase 2:**
1. Review this plan for structural soundness
2. Confirm or refine headline choice (Section 2 of brief offers 3 candidates)
3. Flag any wireframe sections that don't match your mental model
4. Confirm unconfirmed diagram components (BFF layer, settings page, ECB wording, 10-of-416 vs 85%)

**Phase 2 will deliver:**
- Token system in CSS (colors, type, spacing, shape)
- Self-hosted IBM Plex Sans + Mono fonts
- Global CSS (reset, primitives, utilities)
- Background grid + structural rails
- Layout primitives (Section, Rail, Ledger, Chip, Diagram components)
- Header, footer, routing setup
- Pre-rendering config (vite-react-ssg or equivalent)
- Content type definitions (`src/content/*.ts`) with résumé facts filled in

**Estimated effort:** Phases 2-6 will take 8-12 hours of focused work. I'll commit after each phase and update `docs/REDESIGN_NOTES.md` with progress.

---

**End of Design Plan.**  
**Awaiting approval to proceed to Phase 2.**
