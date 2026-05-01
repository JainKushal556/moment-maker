import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/templates/proposal/charming-proposal/',
  build: {
    outDir: '../../../public/templates/proposal/charming-proposal',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
