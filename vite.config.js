import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Serves admin.html for /admin/* in dev and preview (production uses netlify.toml redirects).
const adminPage = () => {
  const mw = (req, _res, next) => { if (req.url && /^\/admin(\/|$|\?)/.test(req.url)) req.url = '/admin.html'; next(); };
  return { name: 'admin-page', configureServer(s) { return () => s.middlewares.use(mw); }, configurePreviewServer(s) { return () => s.middlewares.use(mw); } };
};

export default defineConfig({
  plugins: [react(), adminPage()],
  build: { rollupOptions: { input: { main: resolve(__dirname, 'index.html'), admin: resolve(__dirname, 'admin.html') } } }
});
