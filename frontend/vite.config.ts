import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Note: ssgOptions is injected by vite-react-ssg's own defineConfig wrapper.
// We use base vite defineConfig here; ssg build is run via `npx ssg build`.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/health': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
})
