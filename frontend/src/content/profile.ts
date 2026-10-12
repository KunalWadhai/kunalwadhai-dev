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
  
  // Using headline option 1 from brief Section 2
  // (can be changed: options 2-3 or custom)
  headline: 'Full-stack engineer with a backend core.',
  
  bio: 'I design, build, and operate the systems behind hotel operations, from integrations and queues to the interfaces staff use every day.',
  
  social: {
    github: 'https://github.com/KunalWadhai',
    linkedin: 'https://www.linkedin.com/in/kunal-wadhai/',
    twitter: 'https://x.com/AloneWarrior27',
  },
  
  resume: {
    pdfUrl: 'https://drive.google.com/uc?export=download&id=17PSerWGj5S0aRT2TZJnEf_FtyOr91hCA',
  },
} satisfies ProfileContent
