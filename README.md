# Tech People Blog Platform

A modern blog platform built with Astro and TailwindCSS focusing on tech-related content.

## 🚀 Project Structure

```text
/
├── blog-theme/        # Static HTML theme files
│   ├── 404.html
│   ├── about.html 
│   ├── article.html
│   ├── articles.html
│   ├── index.html
│   └── images/
├── public/           # Static assets
│   ├── favicon.svg
│   └── images/
├── src/             # Source code
│   ├── components/  # UI components
│   ├── content/     # Blog content
│   ├── images/      # Image assets
│   ├── layouts/     # Page layouts
│   ├── pages/       # Page routes
│   └── styles/      # CSS styles
├── astro.config.mjs # Astro configuration
├── package.json     # Project dependencies
└── tailwind.config.mjs # Tailwind configuration
```

## 🧞 Commands

| Command                   | Action                                           |
| :----------------------- | :----------------------------------------------- |
| `npm install`            | Installs dependencies                            |
| `npm run dev`            | Starts local dev server at `localhost:4321`      |
| `npm run build`          | Build your production site to `./dist/`          |
| `npm run preview`        | Preview your build locally before deploying      |

## 🏗️ Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Flowbite](https://flowbite.com) - UI Components
- [Markdown/MDX](https://mdxjs.com) - Content
- [Vercel](https://vercel.com) - Deployment

## 👀 Features

- Responsive design
- Tag-based article filtering 
- Article pagination
- Image optimization
- SEO-friendly
- Fast performance
- Markdown content