import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { createApp } from './server/app.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const aiProxyConfig = {
    apiBaseUrl: requireEnv(env, 'CLOUDFLARE_API_BASE_URL'),
    accountId: requireEnv(env, 'CLOUDFLARE_ACCOUNT_ID'),
    apiToken: requireEnv(env, 'CLOUDFLARE_API_TOKEN'),
  };

  return {
    server: {
      proxy: {
        '/abc': {
          target: 'https://xxx.com',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      {
        name: 'express-api',
        configureServer(server) {
          server.middlewares.use('/api', createApp(aiProxyConfig));
        },
      },
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
  };
});

function requireEnv(env: Record<string, string>, name: string) {
  const value = env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
