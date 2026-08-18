import express from 'express';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/hello', (_req, res) => {
    res.json({ message: 'Hello from Express' });
  });

  return app;
}
