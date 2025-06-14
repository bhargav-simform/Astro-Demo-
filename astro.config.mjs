import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwindcss()],
  output: 'server',
  adapter: vercel()
});

