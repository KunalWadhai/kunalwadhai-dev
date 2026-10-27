import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optional: bundle visualizer (install with: npm i -D rollup-plugin-visualizer)
// import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    // Uncomment after installing rollup-plugin-visualizer:
    // visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/health': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    // Target modern browsers — reduces polyfill overhead
    target: 'es2020',
    // Source maps off in production
    sourcemap: false,
    // Warn when chunk > 100KB gzip (enforce JS budget < 150KB initial)
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — stable, cache-forever
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router')
          ) {
            return 'react-vendor'
          }
          // Icons — tree-shaken but still worth isolating
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
          // Fonts — large, load separately
          if (id.includes('node_modules/@fontsource')) {
            return 'fonts'
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
})
