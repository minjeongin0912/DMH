import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Mounts the api/*.js Vercel-style serverless functions as dev middleware,
// so `npm run dev` can exercise the same handlers Vercel runs in production.
function polarApiDevPlugin() {
  return {
    name: 'polar-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url.split('?')[0];
        if (!pathname.startsWith('/api/')) {
          next();
          return;
        }

        const routeName = pathname.replace('/api/', '');
        const filePath = path.resolve(rootDir, 'api', `${routeName}.js`);

        try {
          const mod = await server.ssrLoadModule(filePath);
          await mod.default(req, res);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, rootDir, ''));

  return {
    plugins: [react(), polarApiDevPlugin()],
  };
});
