/**
 * Profile content — single source of truth
 * All content separated from UI per brief Section 1 non-negotiables
 */

export interface ProfileContent {
  name: string
  email: string
  headline: string
  bio: string
  social: {
    github: string
    linkedin: string
    twitter: string
  }
  resume: {
    pdfUrl: string
  }
}

export const profile: ProfileContent = {
  name: 'Kunal Wadhai',
  email: 'kunalwadhai456@gmail.com',
  
  // Direct and specific — no filler, no generic claims
  headline: 'Backend-first full-stack engineer. I own production systems end to end.',
  
  bio: 'I design, build, and operate the platform behind hotel operations at Guestara — from PMS integrations and IoT provisioning to the queues and services that keep 100+ properties running.',
  
  social: {
    github: 'https://github.com/KunalWadhai',
    linkedin: 'https://www.linkedin.com/in/kunal-wadhai/',
    twitter: 'https://x.com/AloneWarrior27',
  },
  
  resume: {
    pdfUrl: 'https://drive.google.com/uc?export=download&id=17PSerWGj5S0aRT2TZJnEf_FtyOr91hCA',
  },
} satisfies ProfileContent
