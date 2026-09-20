/**
 * Experience timeline — résumé Section 3 with ownership-area groupings
 * Two separate Guestara entries per brief audit findings
 */

export interface ExperienceEntry {
  company: string
  role: string
  startDate: string  // YYYY-MM format
  endDate: string | 'Present'
  scope?: string  // One-line scope statement
  areas: OwnershipArea[]
  technologies: string[]
}

export interface OwnershipArea {
  id: string
  title: string
  bullets: string[]
  /** Whether this area is initially expanded (first area of first entry only) */
  defaultExpanded?: boolean
}

export const experience: ExperienceEntry[] = [
  // ── Guestara: Backend Engineer (Full-Stack) ──
  {
    company: 'Guestara',
    role: 'Backend Engineer (Full-Stack)',
    startDate: '2026-02',
    endDate: 'Present',
    scope: 'Platform ownership: 100+ properties, 10+ services on shared package library, PMS integrations, IoT provisioning, real-time booking sync.',
    
    areas: [
      {
        id: 'integration-platform',
        title: 'Integration platform (PMS)',
        defaultExpanded: true,
        bullets: [
          'Built a Node.js microservice ecosystem integrating PMS providers (Beds24, Bifrost, DeathStar), with a shared package library (schemas, utilities, models) reused across 10+ services and a central orchestration service for property metadata, booking sync, inventory updates, and OpenSearch indexing.',
          'Standardized 20+ PMS and payment endpoint integrations with XML/JSON transformation pipelines: 80% fewer manual data errors at a sustained 95%+ automation success rate. Production reliability tracked with AWS CloudWatch dashboards.',
          'Developed 2+ high-throughput booking-sync webhooks with low-latency event dispatch and fast DB sync on BullMQ-backed job queues.',
        ],
      },
      {
        id: 'iot-access',
        title: 'IoT access provisioning',
        bullets: [
          'Built a multi-provider lock abstraction layer unifying Tuya, Seam, and Mosler APIs for room-based access provisioning across 100+ properties. Full CRUD lifecycle for time-bound guest PIN codes aligned to check-in/check-out windows: 99.2% access-code delivery rate.',
          'Built the encryption and signing pipeline for PIN provisioning (AES-256/AES-128, ECB mode per vendor API requirements, PKCS7 padding; HMAC-SHA256 request signing). TTL-based token caching cut Tuya API calls by 60%.',
        ],
      },
      {
        id: 'domain-modeling',
        title: 'Domain modeling and data correctness',
        bullets: [
          'Designed a 4-state reservation finite state machine (Confirmed → Pre-Checkin → Checkin → Checkout/Canceled) with UTC-to-local timezone conversion and SINGLE vs GROUP booking classification: 99.8% reservation sync accuracy.',
          'Unified 3 API sources into one normalized booking object with 1-hour TTL caching: 70% fewer redundant API calls.',
        ],
      },
      {
        id: 'reliability',
        title: 'Reliability, performance, observability',
        bullets: [
          'Built a Redis-backed service health tracing system with a 15-minute sliding window that tracks success/failure ratios across distributed services against configurable warn and critical thresholds, with Microsoft Teams alerting that dispatches real-time failure diagnostics to on-call channels. Reduced manual monitoring overhead across production pipelines.',
          'Cut API response latency by 50% via MongoDB connection pooling and Redis caching.',
        ],
      },
      {
        id: 'frontend',
        title: 'Frontend',
        bullets: [
          'Built an infinite-scroll guidebook selector with cursor-based pagination: 10 records per request (down from 416), ~85% lighter payload, under 150 ms API response.',
          // CONFIRM WITH KUNAL: BFF layer and settings-page work scope before publishing
          '// TODO: Confirm BFF layer (Express, TypeScript, Zod, Axios, AWS Lambda) scope',
          '// TODO: Confirm React settings-page audit and refactor scope',
        ],
      },
    ],
    
    technologies: [
      'Node.js',
      'TypeScript',
      'Express',
      'React',
      'MongoDB',
      'Redis',
      'OpenSearch',
      'BullMQ',
      'AWS Lambda',
      'AWS SQS',
      'AWS EC2',
      'CloudWatch',
      'Tuya IoT',
      'Seam',
      'Mosler',
      'Beds24',
      'Bifrost',
      'DeathStar',
    ],
  },

  // ── Guestara: Backend Developer Intern ──
  {
    company: 'Guestara',
    role: 'Backend Developer Intern',
    startDate: '2025-11',
    endDate: '2026-01',
    scope: 'Mews PMS integration on serverless AWS Lambda.',
    
    areas: [
      {
        id: 'mews-integration',
        title: 'Serverless webhook ingestion',
        defaultExpanded: true,
        bullets: [
          'Built the Mews PMS integration as a serverless AWS Lambda microservice (Serverless Framework), dual-mode deployment (cloud Lambda handler plus local Express server). Processed 5,000+ monthly webhook events across 6 event-discriminator types, with Joi schema validation and providerRefId-based batch deduplication at up to 100 events per POST.',
          'Configured the CI/CD pipeline (Serverless Framework deployment workflows: build, test, Lambda deploy), enabling zero-downtime releases and environment parity between local and cloud.',
          'Layered middleware inside the Lambda service: Mongoose ephemeral connection pooling for cold-start resilience, Joi request validation, unified response shaping, and OpenSearch indexing through a custom client library so reservations are searchable alongside MongoDB persistence.',
        ],
      },
    ],
    
    technologies: [
      'Node.js',
      'TypeScript',
      'AWS Lambda',
      'Serverless Framework',
      'MongoDB',
      'OpenSearch',
      'Joi',
      'Mongoose',
      'Mews API',
    ],
  },

  // ── Zoho: Embedded Systems Trainee ──
  {
    company: 'Zoho',
    role: 'Embedded Systems Trainee',
    startDate: '2025-01',
    endDate: '2025-04',
    scope: 'Hardware-to-cloud range signal: Yocto Linux images, OpenBMC WebUI, real-time sensor telemetry.',
    
    areas: [
      {
        id: 'embedded-firmware',
        title: 'Embedded firmware development',
        defaultExpanded: true,
        bullets: [
          'Built custom Yocto Linux images for BeagleBone Black and Raspberry Pi; wrote build recipes integrating a TMP75 I2C temperature sensor with automated kernel-level initialization.',
          'Extended the OpenBMC WebUI to surface real-time sensor telemetry through D-Bus, delivering live hardware monitoring dashboards.',
        ],
      },
    ],
    
    technologies: [
      'Yocto Project',
      'OpenBMC',
      'Linux',
      'C',
      'Shell Scripting',
      'D-Bus',
      'I2C',
      'Raspberry Pi',
      'BeagleBone Black',
    ],
  },
] satisfies ExperienceEntry[]
