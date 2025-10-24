import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), basicSsl(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
  server: {
    https: false,
    proxy: {
      '/services/stiller': {
        target: 'https://pandadiestro.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/services/, '/services'),
      }
    }
  }
});
