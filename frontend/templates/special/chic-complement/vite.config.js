import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/templates/special/chic-complement/',
  build: {
    outDir: '../../../public/templates/special/chic-complement',
    emptyOutDir: true,
  },
  plugins: [react()],
})
