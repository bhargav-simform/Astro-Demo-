
import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";
// import adapter from '@astrojs/static';

import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  adapter: vercel(),
  // adapter: adapter()
  // middleware: { onRequest }
});

