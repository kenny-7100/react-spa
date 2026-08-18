import type { RequestHandler } from 'express';
import httpProxy from 'http-proxy';

export interface AiProxyConfig {
  apiBaseUrl: string;
  accountId: string;
  apiToken: string;
}

export function createAiProxy(config: AiProxyConfig): RequestHandler {
  const target = buildTarget(config.apiBaseUrl, config.accountId);
  const proxy = httpProxy.createProxyServer({
    target,
    changeOrigin: true,
    headers: {
      authorization: `Bearer ${config.apiToken}`,
    },
  });

  return (req, res) => {
    if (!req.headers['content-type']) {
      req.headers['content-type'] = 'application/json';
    }

    proxy.web(req, res, {}, (error: Error) => {
      console.error('Cloudflare AI proxy request failed:', error.message);

      if (res.headersSent) {
        res.destroy(error);
        return;
      }

      res.status(502).json({ error: 'Cloudflare AI proxy request failed' });
    });
  };
}

function buildTarget(apiBaseUrl: string, accountId: string) {
  const baseUrl = new URL(ensureTrailingSlash(apiBaseUrl));

  if (baseUrl.protocol !== 'https:' && baseUrl.protocol !== 'http:') {
    throw new Error('CLOUDFLARE_API_BASE_URL must use HTTP or HTTPS');
  }

  baseUrl.pathname = `${baseUrl.pathname}${encodeURIComponent(accountId)}/ai`;
  return baseUrl.toString();
}

function ensureTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`;
}
