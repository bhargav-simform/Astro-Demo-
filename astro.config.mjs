
import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";
// import adapter from '@astrojs/static';

import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import solidJs from '@astrojs/solid-js';
import alpinejs from '@astrojs/alpinejs';

export default defineConfig({
  integrations: [
    tailwind(), 
    react(),
    vue(),
    svelte(),
    solidJs({
      include: ['**/components/_OrderProcessor.jsx']
    }),
    alpinejs()
  ],
  output: 'server',
  adapter: vercel(),
  // adapter: adapter()
  // middleware: { onRequest }
});

