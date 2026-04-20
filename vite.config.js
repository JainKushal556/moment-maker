import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('matter-js')) return 'vendor-physics';
            if (id.includes('lucide-react') || id.includes('lenis') || id.includes('canvas-confetti')) return 'vendor-ui';
          }
        },
      },
    },
  },
})
