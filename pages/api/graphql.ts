import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { getAccessToken } from '@/src/features/auth/server';

const app = express();

app.use('*', async (originalReq: any, originalRes: any, next) => {
  const accessToken = await getAccessToken(originalReq, originalRes);

  return createProxyMiddleware({
    target: process.env.GRAPHQL_URL,
    changeOrigin: true,
    proxyTimeout: 5000,
    secure: false,
    headers: {
      Connection: 'keep-alive',
    },
    pathRewrite: {
      '^/api/graphql': '/graphql',
    },
    onError: (_err, _req, res) => {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end(
        'Something went wrong. And we are reporting a custom error message.',
      );
    },
    onProxyReq: (proxyReq, req) => {
      if (accessToken !== null && accessToken !== '') {
        proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
      }

      if (req.body) {
        const bodyData = JSON.stringify(req.body);

        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })(originalReq, originalRes, next);
});

export default app;
