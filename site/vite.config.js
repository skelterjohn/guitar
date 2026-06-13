import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const gcsPdfOrigin = 'https://storage.googleapis.com/skelterjohnguitar-pdf';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/pdf': {
        target: gcsPdfOrigin,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf/, ''),
      },
    },
  },
});
