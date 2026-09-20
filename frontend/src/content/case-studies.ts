/**
 * Case studies — 5 standalone pages with fixed structure
 * Context → Constraints → Architecture → Key Decisions → Outcome → Stack
 */

export interface CaseStudy {
  id: string
  slug: string
  title: string
  company: string
  dateRange: string
  oneLiner: string  // For work index page
  
  // Case study page structure
  context: string[]  // 2-3 sentences
  constraints: string[]
  architectureDescription: string[]  // 2-3 sentences describing the flow
  keyDecisions: Decision[]
  outcomes: Outcome[]
  stack: string[]
  
  // Next case study in sequence
  nextSlug?: string
}

export interface Decision {
  decision: string
  alternative: string
  reason: string
}

export interface Outcome {
  label: string
  value: string
}

export const caseStudies: CaseStudy[] = [
  // ── 1. Multi-Provider Smart-Lock Provisioning ──
  {
    id: '1',
    slug: 'smart-lock-provisioning',
    title: 'Multi-provider smart-lock provisioning',
    company: 'Guestara',
    dateRange: 'Feb 2026 – Present',
    oneLiner: '100+ properties · 99.2% PIN delivery · 60% fewer Tuya API calls',
    
    context: [
      'Hotel operators needed automated room access provisioning across 100+ properties without vendor lock-in.',
      'Guests receive time-bound digital PIN codes aligned to check-in/check-out windows, eliminating manual key handoff.',
      'The system had to unify three vendor APIs (Tuya, Seam, Mosler) with different authentication, encryption, and device-management protocols.',
    ],
    
    constraints: [
      'Unreliable vendor APIs (Tuya rate limits, Seam intermittent 5xx errors, Mosler inconsistent webhook delivery)',
      'Timezone edge cases: UTC-to-local conversion for check-in windows across properties in different timezones',
      'Encryption and signing per vendor spec: AES-256/128 + HMAC-SHA256, ECB mode dictated by Tuya API requirements',
      'Cold-start overhead: serverless Lambda functions need fast token refresh without blocking PIN creation',
    ],
    
    architectureDescription: [
      'Reservation events trigger an access policy calculator (room mapping, check-in/out window, timezone).',
      'The policy feeds a provider adapter interface that abstracts Tuya, Seam, and Mosler behind a uniform CRUD API.',
      'Encryption/signing happens inline (AES + HMAC per vendor), with a TTL-based token cache (Redis, 1-hour expiry) to avoid redundant auth calls.',
      'Vendor APIs return PIN lifecycle status (created, active, expired, deleted), tracked in MongoDB and surfaced to operators via the booking dashboard.',
    ],
    
    keyDecisions: [
      {
        decision: 'Abstraction layer over 3 providers',
        alternative: 'Single-vendor integration (Tuya only)',
        reason: 'Avoid vendor lock-in; properties use different smart-lock brands. Uniform API simplifies booking-flow logic.',
      },
      {
        decision: 'TTL-based token caching (1-hour expiry)',
        alternative: 'Request-time authentication on every PIN operation',
        reason: '60% fewer Tuya API calls; reduced rate-limit exposure; faster PIN creation (no auth roundtrip).',
      },
      {
        decision: 'ECB mode encryption for Tuya',
        alternative: 'CBC or GCM mode (more secure)',
        reason: 'Tuya API specification requires ECB mode; not a choice. Mitigated by HMAC-SHA256 request signing for integrity.',
      },
      {
        decision: 'Separate PIN state machine (create → active → expired → delete)',
        alternative: 'Fire-and-forget PIN creation with no status tracking',
        reason: 'Operators need visibility into access-code delivery; debugging guest lockout issues requires state history.',
      },
    ],
    
    outcomes: [
      { label: 'Properties with provisioned access', value: '100+' },
      { label: 'PIN delivery rate', value: '99.2%' },
      { label: 'Reduction in Tuya API calls (via TTL cache)', value: '60%' },
      { label: 'Average PIN creation latency', value: '<500ms' },
    ],
    
    stack: [
      'Node.js',
      'TypeScript',
      'Redis',
      'MongoDB',
      'Tuya IoT API',
      'Seam API',
      'Mosler API',
      'AES-256/128',
      'HMAC-SHA256',
    ],
    
    nextSlug: 'pms-webhook-ingestion',
  },

  // ── 2. PMS Webhook Ingestion on Serverless ──
  {
    id: '2',
    slug: 'pms-webhook-ingestion',
    title: 'PMS webhook ingestion on serverless',
    company: 'Guestara',
    dateRange: 'Nov 2025 – Jan 2026',
    oneLiner: '5,000+ events/mo · zero-downtime releases · dual-mode deployment',
    
    context: [
      'Mews PMS sends webhook events for booking lifecycle changes (new reservation, check-in, checkout, cancellation).',
      'The business needed real-time booking sync to keep the Guestara platform in sync with property-management systems.',
      'The integration had to run serverlessly (AWS Lambda) for cost efficiency, but also support local development parity.',
    ],
    
    constraints: [
      'Batch webhook payloads: Mews sends up to 100 events per POST, across 6 event types (Reservation, Space, Customer, etc.)',
      'Duplicate events: same providerRefId can appear multiple times in a batch; deduplication required',
      'Cold starts: Lambda ephemeral connections to MongoDB need fast initialization without timing out',
      'Environment parity: local Express server for dev/test must match Lambda production behavior',
    ],
    
    architectureDescription: [
      'Mews webhook POSTs hit an AWS Lambda handler (Serverless Framework deployment).',
      'Middleware pipeline: Joi schema validation → batch deduplication by providerRefId → Mongoose ephemeral connection → unified response shaping.',
      'Events are persisted to MongoDB and indexed in OpenSearch (via custom client library) for searchable booking history.',
      'Dual-mode deployment: `serverless deploy` for cloud Lambda; `node server.js` for local Express server with identical middleware stack.',
    ],
    
    keyDecisions: [
      {
        decision: 'Dual-mode deployment (Lambda + Express)',
        alternative: 'Cloud-only Lambda with mocked local testing',
        reason: 'Environment parity reduces production surprises; local Express server enables fast iteration without deploy cycles.',
      },
      {
        decision: 'Batch deduplication by providerRefId before DB write',
        alternative: 'Unique index on providerRefId (let DB handle dupes)',
        reason: 'Prevents redundant DB writes and OpenSearch indexing; reduces load on downstream systems.',
      },
      {
        decision: 'Ephemeral Mongoose connection pooling',
        alternative: 'Persistent Lambda container reuse with connection caching',
        reason: 'Cold-start resilience: connection failures don\'t cascade across invocations; simplifies error handling.',
      },
      {
        decision: 'OpenSearch indexing alongside MongoDB',
        alternative: 'MongoDB-only storage with regex queries',
        reason: 'Operators need full-text search across guest names, booking IDs, property names; OpenSearch query latency <50ms vs MongoDB regex >500ms.',
      },
    ],
    
    outcomes: [
      { label: 'Monthly webhook events processed', value: '5,000+' },
      { label: 'Event types handled', value: '6' },
      { label: 'Max batch size per POST', value: '100 events' },
      { label: 'Deployment frequency', value: 'Zero-downtime releases via Serverless Framework CI/CD' },
    ],
    
    stack: [
      'Node.js',
      'TypeScript',
      'AWS Lambda',
      'Serverless Framework',
      'Express',
      'MongoDB',
      'Mongoose',
      'OpenSearch',
      'Joi',
      'Mews API',
    ],
    
    nextSlug: 'reservation-state-machine',
  },

  // ── 3. Reservation State Machine + Booking Normalization ──
  {
    id: '3',
    slug: 'reservation-state-machine',
    title: 'Reservation state machine and booking normalization',
    company: 'Guestara',
    dateRange: 'Feb 2026 – Present',
    oneLiner: '99.8% sync accuracy · 70% fewer redundant API calls · 4-state FSM',
    
    context: [
      'Booking data flows from 3 sources: PMS webhooks, OTA APIs (Booking.com, Airbnb), and manual operator entries.',
      'Each source has different schemas, timezone representations, and booking lifecycle semantics.',
      'The platform needed a single normalized booking object and a state machine to track reservation progression from confirmation to checkout.',
    ],
    
    constraints: [
      'Timezone chaos: PMS sends UTC timestamps, OTAs send local times without offset, operators enter times in property timezone',
      'Overlapping states: some sources treat "confirmed" and "pre-checkin" as the same; others distinguish them',
      'SINGLE vs GROUP bookings: group reservations (multi-room) need different handling than single-room bookings',
      'Race conditions: simultaneous updates from webhook + manual edit can create sync conflicts',
    ],
    
    architectureDescription: [
      'A 4-state finite state machine (Confirmed → Pre-Checkin → Checkin → Checkout/Canceled) normalizes booking lifecycle across all sources.',
      'UTC-to-local timezone conversion happens at ingestion; all timestamps stored in UTC, displayed in property timezone.',
      'SINGLE vs GROUP classification: group bookings link multiple reservations under one parent ID; transitions apply to all child reservations.',
      'Three API sources (PMS, OTA, manual) feed a unified booking object with 1-hour TTL cache (Redis) to reduce redundant API calls.',
    ],
    
    keyDecisions: [
      {
        decision: '4-state FSM (Confirmed → Pre-Checkin → Checkin → Checkout)',
        alternative: 'Free-form status strings ("booked", "arriving", "in-house", "departed")',
        reason: 'State machine enforces valid transitions; prevents invalid states (e.g., checkout before checkin); simplifies UI logic.',
      },
      {
        decision: 'UTC storage + display-time conversion',
        alternative: 'Store timestamps in property timezone',
        reason: 'UTC eliminates daylight-saving ambiguity; property timezone changes (rare but happens) don\'t corrupt historical data.',
      },
      {
        decision: 'SINGLE vs GROUP classification at ingestion',
        alternative: 'Treat all bookings as SINGLE; handle groups in UI layer',
        reason: 'State transitions apply to entire group (e.g., cancel parent → cancel all children); classification must be domain-level, not UI-level.',
      },
      {
        decision: '1-hour TTL cache for normalized booking object',
        alternative: 'Real-time API calls on every booking fetch',
        reason: '70% fewer redundant API calls; booking data rarely changes within 1 hour; cache invalidation on webhook events keeps data fresh.',
      },
    ],
    
    outcomes: [
      { label: 'Reservation sync accuracy', value: '99.8%' },
      { label: 'Reduction in redundant API calls (via 1-hour TTL cache)', value: '70%' },
      { label: 'Invalid state transitions prevented', value: '100% (enforced by FSM)' },
      { label: 'Timezone conversion errors', value: '0 (UTC normalization)' },
    ],
    
    stack: [
      'Node.js',
      'TypeScript',
      'MongoDB',
      'Redis',
      'FSM (state machine library)',
      'Luxon (timezone handling)',
    ],
    
    nextSlug: 'service-health-tracing',
  },

  // ── 4. Service Health Tracing + Alerting ──
  {
    id: '4',
    slug: 'service-health-tracing',
    title: 'Service health tracing and alerting',
    company: 'Guestara',
    dateRange: 'Feb 2026 – Present',
    oneLiner: 'Redis sliding window · configurable thresholds · Teams alerts with diagnostics',
    
    context: [
      'Production failures (PMS API timeouts, lock vendor 5xx errors, queue backpressure) were going unnoticed until operators reported broken workflows.',
      'Manual monitoring (CloudWatch log tailing) was reactive and time-consuming.',
      'The business needed proactive alerting: detect recurring failures, dispatch diagnostics to on-call channels, reduce mean time to detect (MTTD).',
    ],
    
    constraints: [
      'Distributed services: 10+ microservices with independent failure modes; can\'t monitor each one manually',
      'Noisy alerts: transient failures (network blips, vendor API hiccups) shouldn\'t trigger pages; only sustained degradation matters',
      'Context-specific thresholds: PMS sync can tolerate 5% error rate; lock provisioning needs <1% failure for SLA compliance',
      'Alert fatigue: too many alerts → ignored alerts → undetected outages',
    ],
    
    architectureDescription: [
      'Services emit success/failure events (via lightweight logging wrapper) to a central Redis stream.',
      'A 15-minute sliding window tracks success/failure ratios for each service, compared against configurable warn (e.g., 90% success) and critical (e.g., 80% success) thresholds.',
      'Threshold breaches trigger Microsoft Teams alerts with real-time diagnostics (failed endpoint, error count, last 5 error messages, runbook link).',
      'CloudWatch dashboards run alongside for historical trends and deep-dive analysis.',
    ],
    
    keyDecisions: [
      {
        decision: '15-minute sliding window',
        alternative: '1-minute window (faster detection) or 1-hour window (less noise)',
        reason: '15min balances noise vs MTTD: filters transient blips, detects sustained degradation fast enough for SLA compliance.',
      },
      {
        decision: 'Configurable warn/critical thresholds per service',
        alternative: 'Global threshold (e.g., 95% success for all services)',
        reason: 'Different services have different SLA requirements; PMS sync tolerates higher error rates than lock provisioning.',
      },
      {
        decision: 'Teams alerts with inline diagnostics',
        alternative: 'Generic "service X failing" alerts with manual CloudWatch lookup',
        reason: 'Inline diagnostics (failed endpoint, error messages, runbook) cut time-to-mitigation; on-call engineers don\'t context-switch to CloudWatch.',
      },
      {
        decision: 'Redis sliding window (not time-series DB)',
        alternative: 'InfluxDB or Prometheus for time-series metrics',
        reason: 'Redis already in stack; sliding-window logic is 20 lines of Lua script; no new infrastructure; <10ms query latency.',
      },
    ],
    
    outcomes: [
      { label: 'Manual monitoring overhead', value: 'Reduced across production pipelines' },
      { label: 'Sliding window duration', value: '15 minutes' },
      { label: 'Services monitored', value: '10+' },
      { label: 'Alert channels', value: 'Microsoft Teams (on-call channels)' },
    ],
    
    stack: [
      'Node.js',
      'TypeScript',
      'Redis',
      'AWS CloudWatch',
      'Microsoft Teams API',
      'Lua (Redis scripting)',
    ],
    
    nextSlug: 'shared-platform-library',
  },

  // ── 5. Shared Platform Library + Integration Orchestration ──
  {
    id: '5',
    slug: 'shared-platform-library',
    title: 'Shared platform library and integration orchestration',
    company: 'Guestara',
    dateRange: 'Feb 2026 – Present',
    oneLiner: '20+ integrations · 10+ services · 80% fewer manual errors · 50% lower latency',
    
    context: [
      '10+ microservices (PMS sync, lock provisioning, payment processing, booking normalization) were duplicating schemas, utilities, and models.',
      'Code drift: each service had its own booking schema, timezone logic, and error-handling patterns, leading to sync bugs and manual data reconciliation.',
      'A central orchestration service coordinates property metadata, booking sync, inventory updates, and OpenSearch indexing across all integrations.',
    ],
    
    constraints: [
      'Schema drift: adding a new booking field required updating 10+ services; high risk of missed updates',
      'Dependency hell: updating a shared utility (e.g., timezone converter) required coordinated deploys across services',
      'Integration sprawl: 20+ PMS, OTA, and payment endpoints with different auth, retry logic, and error schemas',
      'Observability gaps: no unified way to track booking flow across services (PMS → normalization → lock → dashboard)',
    ],
    
    architectureDescription: [
      'A shared NPM package (`@guestara/platform-lib`) exports: TypeScript schemas (Zod), utilities (timezone, retry logic, error formatting), and Mongoose models.',
      '10+ services import the library; schema changes propagate via version bumps and coordinated deploys (tracked in CI/CD pipeline).',
      'Central orchestration service acts as the coordination layer: property metadata (room types, rate plans), booking sync (PMS → normalization → lock), inventory updates, OpenSearch indexing.',
      'Standardized 20+ integrations: uniform auth (JWT + API keys), retry logic (exponential backoff), and error schemas (code + message + context).',
    ],
    
    keyDecisions: [
      {
        decision: 'Shared NPM package for schemas/utils/models',
        alternative: 'Copy-paste shared code across services',
        reason: 'Single source of truth for booking schema; version bumps track changes; TypeScript types prevent drift.',
      },
      {
        decision: 'Central orchestration service (not event-driven choreography)',
        alternative: 'Pure event-driven architecture (services subscribe to booking events)',
        reason: 'Orchestration provides observability (booking flow traced in one place); choreography scatters logic across services, hard to debug.',
      },
      {
        decision: 'Standardized integration layer (auth + retry + error schemas)',
        alternative: 'Per-integration bespoke wrappers',
        reason: '80% fewer manual data errors; uniform retry logic prevents cascade failures; error schemas enable automated alerting.',
      },
      {
        decision: 'OpenSearch indexing in orchestration service',
        alternative: 'Each service indexes its own data',
        reason: 'Unified search across bookings, guests, properties, payments; orchestration service knows complete booking lifecycle.',
      },
    ],
    
    outcomes: [
      { label: 'Integrations standardized', value: '20+' },
      { label: 'Services consuming shared library', value: '10+' },
      { label: 'Manual data errors', value: '80% reduction' },
      { label: 'Automation success rate', value: '95%+' },
      { label: 'API latency', value: '50% reduction (connection pooling + Redis caching)' },
    ],
    
    stack: [
      'Node.js',
      'TypeScript',
      'Zod',
      'MongoDB',
      'Mongoose',
      'Redis',
      'OpenSearch',
      'BullMQ',
      'AWS SQS',
    ],
    
    // Sub-section: Frontend data-fetching work
    // (Rendered inline in case study page, Phase 3)
    // 10 records per request (down from 416), <150ms, ~85% lighter payload
  },
] satisfies CaseStudy[]
