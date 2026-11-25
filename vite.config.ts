import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5300,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://campuscultura-api.aaron-navarro.workers.dev/api',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('proxyReq', proxyReq => {
            proxyReq.removeHeader('origin');
          });
        },
      },
    },
  },
});
