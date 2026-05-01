import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/templates/birthday/pearl-glow-birthday/',
  build: {
    outDir: '../../../public/templates/birthday/pearl-glow-birthday',
    emptyOutDir: true,
  },
  plugins: [react()],
})
