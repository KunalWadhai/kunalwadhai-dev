/**
 * Other projects — secondary to case studies
 * FoodSnatch, SQLShield-NIDS, plus verified repo projects
 */

export interface Project {
  name: string
  description: string
  url?: string
  githubUrl?: string
  stack: string[]
}

export const projects: Project[] = [
  {
    name: 'DSA Forge',
    description: 'RAG-powered DSA learning platform with intelligent Q&A. Vector search (Pinecone) retrieves relevant content from curated knowledge base, NVIDIA LLM generates contextual answers with source citations. JWT auth, conversation memory, markdown rendering. 82% test coverage, <3s RAG pipeline latency.',
    url: 'https://dsa-forge-drab.vercel.app',
    githubUrl: 'https://github.com/KunalWadhai/dsaForge',
    stack: ['Next.js 14', 'TypeScript', 'Express', 'MongoDB', 'Pinecone', 'NVIDIA LLM', 'Google Gemini', 'JWT'],
  },
  {
    name: 'FoodSnatch',
    description: 'Food discovery platform with role-based JWT auth, personalized content, and dynamic image transformation via ImageKit CDN. HTTPS load-balanced deployment with 99% uptime, Redis caching for high-concurrency menu reads, MongoDB indexing.',
    url: 'https://foodsnatch.onrender.com',
    githubUrl: 'https://github.com/KunalWadhai/foodSnatch',
    stack: ['Node.js', 'Express', 'React', 'MongoDB', 'Redis', 'ImageKit CDN'],
  },
  {
    name: 'SQLShield-NIDS',
    description: 'ML-powered network intrusion detection for SQL injection attacks. 99% detection accuracy using Scikit-learn on real-time traffic analysis, with a Flask monitoring dashboard.',
    githubUrl: 'https://github.com/KunalWadhai/SQLShield-NIDS',
    stack: ['Python', 'Flask', 'MySQL', 'Pandas', 'Scikit-learn'],
  },
  // Add SupportIQ AI if repo verified
  // {
  //   name: 'SupportIQ AI',
  //   description: 'Multi-tenant RAG-powered support automation. Organizations upload docs; the system generates an embeddable chat widget backed by vector search. Per-org data isolation.',
  //   githubUrl: 'https://github.com/KunalWadhai/SupportIQ.ai',
  //   stack: ['Next.js 14', 'TypeScript', 'FastAPI', 'LangChain', 'PostgreSQL', 'Qdrant', 'Redis', 'Docker', 'BullMQ'],
  // },
] satisfies Project[]
