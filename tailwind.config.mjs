/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./blog-theme/**/*.html' // Add this line
	],
	theme: {
		extend: {},
	},
	plugins: [],
}