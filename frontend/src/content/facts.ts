/**
 * Facts ledger — measured outcomes from résumé Section 3
 * Each fact links to its case study (implemented in Phase 3)
 */

export interface Fact {
  label: string
  value: string
  /** Case study slug this fact links to */
  caseStudy?: string
}

export const facts: Fact[] = [
  {
    label: '100+ properties with provisioned access',
    value: '100+',
    caseStudy: 'smart-lock-provisioning',
  },
  {
    label: '5,000+ webhook events processed per month',
    value: '5,000+',
    caseStudy: 'pms-webhook-ingestion',
  },
  {
    label: '99.2% PIN delivery rate',
    value: '99.2%',
    caseStudy: 'smart-lock-provisioning',
  },
  {
    label: '99.8% reservation sync accuracy',
    value: '99.8%',
    caseStudy: 'reservation-state-machine',
  },
  {
    label: '10+ services on shared library',
    value: '10+',
    caseStudy: 'shared-platform-library',
  },
  {
    label: '50% lower API latency',
    value: '50%',
    caseStudy: 'shared-platform-library',
  },
] satisfies Fact[]
