// node_modules/preact/dist/preact.mjs
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/NoteCards.tsx
function isArticle(page) {
  const slug = page.slug ?? "";
  if (slug === "" || slug === "index" || slug === "404") return false;
  if (slug === "tags" || slug.startsWith("tags/")) return false;
  if (slug.endsWith("/index")) return false;
  return true;
}
function pageDate(page) {
  return page.dates?.modified ?? page.dates?.created;
}
function formatDate(d2, locale) {
  return d2.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}
var NoteCards = ({ fileData, allFiles, cfg }) => {
  if (fileData.slug !== "index") return null;
  const locale = cfg?.locale ?? "ru-RU";
  const pages = allFiles.filter(isArticle).sort((a2, b2) => (pageDate(b2)?.getTime() ?? 0) - (pageDate(a2)?.getTime() ?? 0));
  if (pages.length === 0) return null;
  return /* @__PURE__ */ u2("div", { class: "note-cards", children: pages.map((page) => {
    const title = page.frontmatter?.title ?? page.slug;
    const date = pageDate(page);
    const desc = (page.description ?? "").trim();
    return /* @__PURE__ */ u2("a", { class: "note-card", href: `./${page.slug}`, children: [
      date && /* @__PURE__ */ u2("span", { class: "note-card-date", children: formatDate(date, locale) }),
      /* @__PURE__ */ u2("h3", { children: title }),
      desc.length > 0 && /* @__PURE__ */ u2("p", { children: desc })
    ] });
  }) });
};
var NoteCards_default = (() => NoteCards);

export { NoteCards_default as NoteCards };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map