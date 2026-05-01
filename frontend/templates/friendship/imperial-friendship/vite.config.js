import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/templates/friendship/imperial-friendship/',
  build: {
    outDir: '../../../public/templates/friendship/imperial-friendship',
    emptyOutDir: true,
  },
  plugins: [react()],
})
