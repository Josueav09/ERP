import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    cors: true,
    allowedHosts: [
      'growvia-app-frontend.ashygrass-1b0d0ce7.eastus.azurecontainerapps.io'
    ]
  },
  // ✅ IMPORTANTE: Configuración para SPA
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  // ✅ Para desarrollo con React Router
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});