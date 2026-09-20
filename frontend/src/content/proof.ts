/**
 * Proof and fundamentals — LeetCode, HackerRank, education
 * Static snapshot as of Sep 2026 (per brief Section 7.7)
 */

export interface ProofData {
  leetcode: {
    handle: string
    url: string
    rating: number
    streak: number
    problemsSolved: number
  }
  hackerrank: {
    handle: string
    url: string
    badges: { language: string; stars: number }[]
  }
  education: {
    degree: string
    school: string
    graduationDate: string
    cgpa: number
  }
  snapshotDate: string
}

export const proof: ProofData = {
  leetcode: {
    handle: 'KunalWadhai11011',
    url: 'https://leetcode.com/u/KunalWadhai11011/',
    rating: 1505,
    streak: 500,
    problemsSolved: 500,
  },
  hackerrank: {
    handle: 'Kunal_Wadhai',
    url: 'https://www.hackerrank.com/profile/Kunal_Wadhai',
    badges: [
      { language: 'Java', stars: 5 },
      { language: 'C++', stars: 5 },
    ],
  },
  education: {
    degree: 'B.E. Computer Science',
    school: 'Government College of Engineering, Chandrapur',
    graduationDate: 'June 2025',
    cgpa: 8.53,
  },
  snapshotDate: 'September 2026',
} satisfies ProofData
