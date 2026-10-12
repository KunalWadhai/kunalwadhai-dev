import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/health': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  // @ts-ignore - ssgOptions is added by vite-react-ssg
  ssgOptions: {
    includedRoutes() {
      // Pre-render all case study pages statically
      return [
        '/',
        '/work/smart-lock-provisioning',
        '/work/pms-webhook-ingestion',
        '/work/reservation-state-machine',
        '/work/service-health-tracing',
        '/work/shared-platform-library',
      ]
    },
  },
})
