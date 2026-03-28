function profileToContext(p) {
  const parts = []
  parts.push(`Name: ${p.name}`)
  parts.push(`Title: ${p.title}`)
  parts.push(`Location: ${p.location}`)

  if (p.education?.length) {
    parts.push('Education:')
    for (const e of p.education) {
      parts.push(
        `- ${e.school} (${e.startYear} - ${e.endYear}) | Degree: ${e.degree}`,
      )
    }
  }

  if (p.experience?.length) {
    parts.push('Experience:')
    for (const ex of p.experience) {
      const when = ex.end ? `${ex.start} - ${ex.end}` : `${ex.start} - present`
      parts.push(`- ${ex.company}: ${ex.role} (${when})`)
      if (Array.isArray(ex.achievements) && ex.achievements.length) {
        for (const a of ex.achievements) parts.push(`  * ${a}`)
      }
      if (Array.isArray(ex.technologies) && ex.technologies.length) {
        parts.push(`  Tech: ${ex.technologies.join(', ')}`)
      }
      if (Array.isArray(ex.integrations) && ex.integrations.length) {
        parts.push(`  Integrations: ${ex.integrations.join(', ')}`)
      }
    }
  }

  if (p.projects?.length) {
    parts.push('Projects:')
    for (const pr of p.projects) {
      parts.push(`- ${pr.name}: ${pr.description}`)
      parts.push(`  Links: ${pr.url} | GitHub: ${pr.githubUrl || 'n/a'}`)
      if (Array.isArray(pr.technologies) && pr.technologies.length) {
        parts.push(`  Tech: ${pr.technologies.join(', ')}`)
      }
    }
  }

  if (p.skills?.groups) {
    parts.push('Skills:')
    for (const [group, items] of Object.entries(p.skills.groups)) {
      parts.push(`- ${group}: ${items.join(', ')}`)
    }
  }

  if (p.social?.email) parts.push(`Email: ${p.social.email}`)
  if (p.social?.githubUrl) parts.push(`GitHub: ${p.social.githubUrl}`)
  if (p.social?.linkedinUrl) parts.push(`LinkedIn: ${p.social.linkedinUrl}`)
  if (p.social?.leetcodeUrl) parts.push(`LeetCode: ${p.social.leetcodeUrl}`)
  if (p.social?.xUrl) parts.push(`X: ${p.social.xUrl}`)

  return parts.join('\n')
}
