import type { RouteRecord } from 'vite-react-ssg'
import { HomePage } from './pages/HomePage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const routes: RouteRecord[] = [
  { path: '/', Component: HomePage },
  { path: '/work/:slug', Component: CaseStudyPage },
  { path: '*', Component: NotFoundPage },
]

// Concrete paths for static pre-rendering (consumed by vite-react-ssg includedRoutes)
export const staticPaths = [
  '/',
  '/work/smart-lock-provisioning',
  '/work/pms-webhook-ingestion',
  '/work/reservation-state-machine',
  '/work/service-health-tracing',
  '/work/shared-platform-library',
]
