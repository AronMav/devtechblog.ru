// src/util/path.ts
function pathToRoot(slug) {
  let rootPath = slug.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_2) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
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

// src/components/NavLinks.tsx
var NavLinks = ({ fileData, displayClass }) => {
  const base = pathToRoot(fileData.slug);
  return /* @__PURE__ */ u2("nav", { class: `nav-links ${displayClass ?? ""}`, children: [
    /* @__PURE__ */ u2("a", { href: base, children: "\u0437\u0430\u043C\u0435\u0442\u043A\u0438" }),
    /* @__PURE__ */ u2("a", { href: `${base}/tags`, children: "\u0442\u0435\u0433\u0438" })
  ] });
};
NavLinks.beforeDOMLoaded = `
if (!sessionStorage.getItem("explorerScrollTop")) {
  sessionStorage.setItem("explorerScrollTop", "0");
}
`;
NavLinks.afterDOMLoaded = `
var ccNarrow = window.matchMedia("(max-width: 1279px)");

function ccPrepareDrawers() {
  if (!ccNarrow.matches) return;
  document.querySelectorAll(".explorer").forEach(function (ex) {
    ex.classList.add("collapsed", "js-ready");
    ex.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll(".toc").forEach(function (toc) {
    var btn = toc.querySelector("button.toc-header");
    var content = toc.querySelector(".toc-content");
    if (btn) {
      btn.classList.add("collapsed");
      btn.setAttribute("aria-expanded", "false");
    }
    if (content) content.classList.add("collapsed");
    toc.classList.add("js-ready");
  });
}

function ccCloseDrawers(target) {
  if (!ccNarrow.matches) return;
  var ex = document.querySelector(".explorer");
  if (ex && !ex.classList.contains("collapsed") && !(target && ex.contains(target))) {
    var exBtn = ex.querySelector("button.desktop-explorer");
    if (exBtn) exBtn.click();
  }
  var tocBtn = document.querySelector(".toc button.toc-header");
  if (tocBtn && !tocBtn.classList.contains("collapsed")) {
    var toc = tocBtn.closest(".toc");
    if (!(target && toc && toc.contains(target))) tocBtn.click();
  }
}

ccPrepareDrawers();
document.addEventListener("nav", ccPrepareDrawers);
document.addEventListener("click", function (e) { ccCloseDrawers(e.target); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") ccCloseDrawers(null);
});
`;
var NavLinks_default = (() => NavLinks);

export { NavLinks_default as NavLinks };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map