import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
  server: {
    proxy: {
      '/services/stiller': {
        target: 'https://pandadiestro.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/services/, '/services'),
      }
    }
  }
});
