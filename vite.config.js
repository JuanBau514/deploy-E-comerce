import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  assetsInclude: ['**/*.html'], // Agrega esta línea para incluir archivos HTML como activos
});