import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/templates/proposal/romantic-proposal/',
  build: {
    outDir: '../../../public/templates/proposal/romantic-proposal',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('swiper')) return 'vendor-swiper';
            if (id.includes('sweetalert2')) return 'vendor-swal';
            if (id.includes('lucide-react') || id.includes('canvas-confetti')) return 'vendor-ui';
          }
        },
      },
    },
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
