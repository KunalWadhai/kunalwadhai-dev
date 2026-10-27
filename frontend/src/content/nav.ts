/**
 * Navigation structure per design brief
 * Desktop: Work · Experience · Skills · Contact · Download résumé
 * Mobile: Home, Work, Experience, Skills, Contact (5 max)
 */

export const desktopNav = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

export const mobileTabs = [
  { id: 'top', label: 'Home', href: '/#top' },
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'experience', label: 'Exp', href: '/#experience' },
  { id: 'skills', label: 'Skills', href: '/#skills' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
] as const
