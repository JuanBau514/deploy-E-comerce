import { defineConfig } from 'vite';

export default defineConfig({
  root: 'frontend', // La raíz del proyecto
  base: './', // Rutas relativas en producción
  build: {
    outDir: '../dist', // Carpeta de salida
    emptyOutDir: true, // Limpia 'dist' antes de compilar
    rollupOptions: {
      input: './frontend/public/userPage.html' // Especifica userPage.html como el archivo de entrada
    }
  },
  publicDir: 'public', // Carpeta para archivos estáticos
});