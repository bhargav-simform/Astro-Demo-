/* empty css                                       */
import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DAKzIXxv.mjs';
import 'kleur/colors';
import { $ as $$MainLayout, c as capitalize } from '../../../chunks/MainLayout_CB1EdXML.mjs';
import { $ as $$ArticleCard } from '../../../chunks/ArticleCard_BvUUGTwx.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_5etZI7HR.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { tag } = Astro2.params;
  if (tag === void 0) {
    throw new Error("Tag is required");
  }
  const allBlogArticles = (await getCollection("blog")).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const tagArticles = allBlogArticles.filter((article) => article.data.tags.includes(tag));
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<a href="/articles" class="inline-block bg-gray-100 p-2 mb-6 hover:bg-indigo-500 hover:text-white">Back To Articles</a> <h1 class="text-2xl pb-3">#${capitalize(tag)}</h1> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> ${tagArticles.map((article) => renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "article": article })}`)} </div> ` })}`;
}, "/home/bhargav/Bhargav Projects/cosmic-centauri/src/pages/articles/tag/[...tag].astro", void 0);

const $$file = "/home/bhargav/Bhargav Projects/cosmic-centauri/src/pages/articles/tag/[...tag].astro";
const $$url = "/articles/tag/[...tag]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
