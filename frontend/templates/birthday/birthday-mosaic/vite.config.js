import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/templates/birthday/birthday-mosaic/',
  build: {
    outDir: '../../../public/templates/birthday/birthday-mosaic',
    emptyOutDir: true,
  },
  plugins: [react()],
});
