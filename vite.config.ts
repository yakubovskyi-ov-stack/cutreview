import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

function normalizeBase(raw: string): string {
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // `||` (not `??`) so an empty CI variable falls back to the default.
  const base = command === 'build' ? normalizeBase(env.VITE_BASE || '/cutreview/') : '/';

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.{ts,tsx}'],
    },
  };
});