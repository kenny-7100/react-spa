import express from 'express';
import { createAiProxy, type AiProxyConfig } from './ai-proxy.js';

export function createApp(aiProxyConfig: AiProxyConfig) {
  const app = express();

  app.use('/ai', createAiProxy(aiProxyConfig));
  app.use(express.json());

  app.get('/hello', (_req, res) => {
    res.json({ message: 'Hello from Express' });
  });

  return app;
}
