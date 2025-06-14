/* empty css                                    */
import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DAKzIXxv.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CB1EdXML.mjs';
import { $ as $$ArticleCard } from '../../chunks/ArticleCard_BvUUGTwx.mjs';
import { $ as $$SearchForm } from '../../chunks/SearchForm_XJ60i3Eo.mjs';
import { g as getCollection } from '../../chunks/_astro_content_5etZI7HR.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  const query = Astro2.url.searchParams.get("query");
  const allBlogArticles = await getCollection("blog");
  const searchResults = allBlogArticles.filter((article) => {
    const titleMatch = article.data.title.toLowerCase().includes(query.toLowerCase());
    const bodyMatch = article.body.toLowerCase().includes(query.toLowerCase());
    const slugMatch = article.slug.toLowerCase().includes(query.toLowerCase());
    return titleMatch || bodyMatch || slugMatch;
  });
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Search Results" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<a href="/articles" class="inline-block bg-gray-100 p-2 mb-5 hover:bg-indigo-500 hover:text-white">All Articles</a> ${renderComponent($$result2, "SearchForm", $$SearchForm, {})} <br> <h1 class="text-2xl pb-3 mt-6">Results For <strong>${query}</strong></h1> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> ${searchResults.map((article) => renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "article": article })}`)} </div> ` })}`;
}, "/home/bhargav/Bhargav Projects/cosmic-centauri/src/pages/articles/search.astro", void 0);

const $$file = "/home/bhargav/Bhargav Projects/cosmic-centauri/src/pages/articles/search.astro";
const $$url = "/articles/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
