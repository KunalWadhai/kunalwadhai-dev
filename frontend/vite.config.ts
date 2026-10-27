import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Note: ssgOptions is injected by vite-react-ssg's own defineConfig wrapper.
// We use base vite defineConfig here; ssg build is run via `npx vite-react-ssg build`.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/health': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    // Manual chunking for better code splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          // Icons (lucide-react tree-shakes unused icons automatically)
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
        },
      },
    },
    // Target modern browsers (reduces polyfills)
    target: 'es2020',
    // Source maps disabled for production size
    sourcemap: false,
  },
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
