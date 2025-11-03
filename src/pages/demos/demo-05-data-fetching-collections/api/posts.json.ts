import type { APIRoute } from 'astro';
import posts from '../_posts.json';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
};
