import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { createApp } from './server/app.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'express-api',
      configureServer(server) {
        server.middlewares.use('/api', createApp());
      },
    },
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
