import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Output directory (default is 'dist')
    emptyOutDir: true,  // Clean output directory before build
  }
});