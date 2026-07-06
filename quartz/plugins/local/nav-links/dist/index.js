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
    /* @__PURE__ */ u2("a", { href: `${base}/tags/`, children: "\u0442\u0435\u0433\u0438" }),
    /* @__PURE__ */ u2("a", { href: `${base}/about`, children: "\u043E\u0431\u043E \u043C\u043D\u0435" })
  ] });
};
NavLinks.beforeDOMLoaded = `
if (!sessionStorage.getItem("explorerScrollTop")) {
  sessionStorage.setItem("explorerScrollTop", "0");
}
`;
NavLinks.afterDOMLoaded = `
var ccNarrow = window.matchMedia("(max-width: 1279px)");

function ccTocBtn() { return document.querySelector(".toc button.toc-header"); }

// \u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u0443\u0435\u0442 \u0432\u0441\u043F\u043E\u043C\u043E\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B: .toc.open (\u0434\u043B\u044F \u0431\u044D\u043A\u0434\u0440\u043E\u043F\u0430 \u2014
// \u0441\u0442\u043E\u043A \u0434\u0435\u0440\u0436\u0438\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0435) \u0438 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0443 \u0441\u043A\u0440\u043E\u043B\u043B\u0430 \u0444\u043E\u043D\u0430.
function ccSync() {
  var ex = document.querySelector(".explorer");
  var exOpen = ex && !ex.classList.contains("collapsed");
  var tb = ccTocBtn();
  var tocOpen = tb && !tb.classList.contains("collapsed");
  var toc = tb && tb.closest(".toc");
  if (toc) toc.classList.toggle("open", !!tocOpen);
  document.body.classList.toggle("cc-drawer-open", ccNarrow.matches && !!(exOpen || tocOpen));
}

// \u041A\u0440\u0435\u0441\u0442\u0438\u043A \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F \u0432\u043D\u0443\u0442\u0440\u0438 \u043F\u0430\u043D\u0435\u043B\u0438 (\u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u043F\u0430\u043D\u0435\u043B\u044C \u043D\u0430\u043A\u0440\u044B\u0432\u0430\u0435\u0442
// \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u043A\u043D\u043E\u043F\u043A\u0443-\u0442\u043E\u0433\u0433\u043B\u0435\u0440 \u2014 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0438\u043D\u0430\u0447\u0435 \u043D\u0435\u0447\u0435\u043C).
function ccEnsureClose(panel, toggler) {
  if (!panel || panel.querySelector(".cc-panel-close")) return;
  var b = document.createElement("button");
  b.className = "cc-panel-close";
  b.setAttribute("aria-label", "\u0417\u0430\u043A\u0440\u044B\u0442\u044C");
  b.textContent = "\u2715";
  b.addEventListener("click", function (e) {
    e.stopPropagation();
    var t = toggler();
    if (t) t.click();
    ccSync();
  });
  panel.prepend(b);
}

function ccPrepareDrawers() {
  if (!ccNarrow.matches) return;
  document.querySelectorAll(".explorer").forEach(function (ex) {
    ex.classList.add("collapsed", "js-ready");
    ex.setAttribute("aria-expanded", "false");
    ccEnsureClose(ex.querySelector(".explorer-content"), function () {
      return ex.querySelector("button.desktop-explorer");
    });
  });
  document.querySelectorAll(".toc").forEach(function (toc) {
    var btn = toc.querySelector("button.toc-header");
    var content = toc.querySelector(".toc-content");
    if (btn) {
      btn.classList.add("collapsed");
      btn.setAttribute("aria-expanded", "false");
    }
    if (content) {
      content.classList.add("collapsed");
      ccEnsureClose(content, function () { return toc.querySelector("button.toc-header"); });
    }
    toc.classList.add("js-ready");
  });
  ccSync();
}

function ccCloseDrawers(target) {
  if (!ccNarrow.matches) return;
  var ex = document.querySelector(".explorer");
  if (ex && !ex.classList.contains("collapsed")) {
    var exContent = ex.querySelector(".explorer-content");
    var exBtn = ex.querySelector("button.desktop-explorer");
    var inside = target && ((exContent && exContent.contains(target)) || (exBtn && exBtn.contains(target)));
    if (!inside && exBtn) exBtn.click();
  }
  var tocBtn = ccTocBtn();
  if (tocBtn && !tocBtn.classList.contains("collapsed")) {
    var toc = tocBtn.closest(".toc");
    var tc = toc && toc.querySelector(".toc-content");
    var insideToc = target && ((tc && tc.contains(target)) || tocBtn.contains(target));
    if (!insideToc) tocBtn.click();
  }
  ccSync();
}

ccPrepareDrawers();
document.addEventListener("nav", ccPrepareDrawers);
document.addEventListener("click", function (e) {
  // \u0412\u044B\u0431\u043E\u0440 \u043F\u0443\u043D\u043A\u0442\u0430 \u0432\u043D\u0443\u0442\u0440\u0438 \u043F\u0430\u043D\u0435\u043B\u0438 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0435\u0451 (\u044F\u043A\u043E\u0440\u044F \u043E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0435
  // \u043F\u043E\u0440\u043E\u0436\u0434\u0430\u044E\u0442 nav-\u0441\u043E\u0431\u044B\u0442\u0438\u0435 \u2014 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u0441\u0430\u043C\u0438; \u0434\u043B\u044F \u0434\u0435\u0440\u0435\u0432\u0430 \u0442\u0430\u043A \u0436\u0435 \u0443\u0434\u043E\u0431\u043D\u0435\u0435)
  if (ccNarrow.matches && e.target && e.target.closest) {
    var link = e.target.closest(".toc-content a, .explorer-content a");
    if (link) {
      var tocBtn2 = link.closest(".toc-content") ? ccTocBtn() : null;
      var exBtn2 = link.closest(".explorer-content")
        ? document.querySelector(".explorer button.desktop-explorer")
        : null;
      var b = tocBtn2 || exBtn2;
      if (b && !b.classList.contains("collapsed")) b.click();
      if (exBtn2) {
        var ex2 = document.querySelector(".explorer");
        if (ex2 && !ex2.classList.contains("collapsed")) exBtn2.click();
      }
      ccSync();
      return;
    }
  }
  ccCloseDrawers(e.target);
  ccSync();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") ccCloseDrawers(null);
});
`;
var NavLinks_default = (() => NavLinks);

export { NavLinks_default as NavLinks };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map