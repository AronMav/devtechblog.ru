// node_modules/unist-util-is/lib/index.js
var convert = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  (function(test) {
    if (test === null || test === void 0) {
      return ok;
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        propertiesFactory(
          /** @type {Props} */
          test
        )
      );
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  })
);
function anyFactory(tests) {
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index2 = -1;
    while (++index2 < checks.length) {
      if (checks[index2].apply(this, parameters)) return true;
    }
    return false;
  }
}
function propertiesFactory(check) {
  const checkAsRecord = (
    /** @type {Record<string, unknown>} */
    check
  );
  return castFactory(all);
  function all(node) {
    const nodeAsRecord = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      node
    );
    let key;
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node) {
    return node && node.type === check;
  }
}
function castFactory(testFunction) {
  return check;
  function check(value, index, parent) {
    return Boolean(
      looksLikeANode(value) && testFunction.call(
        this,
        value,
        typeof index === "number" ? index : void 0,
        parent || void 0
      )
    );
  }
}
function ok() {
  return true;
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value;
}

// node_modules/unist-util-visit-parents/lib/color.node.js
function color(d) {
  return "\x1B[33m" + d + "\x1B[39m";
}

// node_modules/unist-util-visit-parents/lib/index.js
var empty = [];
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
function visitParents(tree, test, visitor, reverse) {
  let check;
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
  } else {
    check = test;
  }
  const is2 = convert(check);
  const step = reverse ? -1 : 1;
  factory(tree, void 0, [])();
  function factory(node, index, parents) {
    const value = (
      /** @type {Record<string, unknown>} */
      node && typeof node === "object" ? node : {}
    );
    if (typeof value.type === "string") {
      const name = (
        // `hast`
        typeof value.tagName === "string" ? value.tagName : (
          // `xast`
          typeof value.name === "string" ? value.name : void 0
        )
      );
      Object.defineProperty(visit2, "name", {
        value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")"
      });
    }
    return visit2;
    function visit2() {
      let result = empty;
      let subresult;
      let offset;
      let grandparents;
      if (!test || is2(node, index, parents[parents.length - 1] || void 0)) {
        result = toResult(visitor(node, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if ("children" in node && node.children) {
        const nodeAsParent = (
          /** @type {UnistParent} */
          node
        );
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];
            subresult = factory(child, offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
      }
      return result;
    }
  }
}
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return value === null || value === void 0 ? empty : [value];
}

// node_modules/unist-util-visit/lib/index.js
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  let reverse;
  let test;
  let visitor;
  if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
    test = void 0;
    visitor = testOrVisitor;
    reverse = visitorOrReverse;
  } else {
    test = testOrVisitor;
    visitor = visitorOrReverse;
    reverse = maybeReverse;
  }
  visitParents(tree, test, overload, reverse);
  function overload(node, parents) {
    const parent = parents[parents.length - 1];
    const index = parent ? parent.children.indexOf(node) : void 0;
    return visitor(node, index, parent);
  }
}

// src/marker.ts
var COLLAPSE_TOKEN = /(^|\s)collapse(?=\s|$)/;
function remarkCollapseMarker() {
  return (tree, file) => {
    const flags = [];
    visit(tree, "code", (node) => {
      const lang = node.lang ?? "";
      if (lang === "" || lang === "mermaid") return;
      const meta = node.meta ?? "";
      const flagged = COLLAPSE_TOKEN.test(meta);
      if (flagged) {
        const stripped = meta.replace(COLLAPSE_TOKEN, "").replace(/\s+/g, " ").trim();
        node.meta = stripped.length > 0 ? stripped : null;
      }
      flags.push(flagged);
    });
    file.data.collapseFlags = flags;
  };
}

// src/wrap.ts
function isPrettyCodeFigure(node) {
  if (node.tagName !== "figure" || !node.properties) return false;
  return Object.keys(node.properties).some(
    (k) => k.toLowerCase().replace(/-/g, "") === "datarehypeprettycodefigure"
  );
}
function addClass(node, cls) {
  const props = node.properties ??= {};
  const existing = props.className;
  if (Array.isArray(existing)) props.className = [...existing, cls];
  else if (typeof existing === "string" && existing.length > 0)
    props.className = [existing, cls];
  else props.className = [cls];
}
function el(tagName, properties, children = []) {
  return { type: "element", tagName, properties, children };
}
function rehypeCollapseWrap() {
  return (tree, file) => {
    const flags = file.data.collapseFlags ?? [];
    let figureIndex = 0;
    let idCounter = 0;
    visit(tree, "element", (node) => {
      if (!isPrettyCodeFigure(node)) return;
      const collapse = flags[figureIndex++] ?? false;
      if (!collapse) return;
      const id = `code-collapse-${idCounter++}`;
      addClass(node, "code-collapsible");
      node.children.push(
        el("input", { type: "checkbox", id, className: ["code-collapse-toggle"], hidden: true }),
        el("label", { htmlFor: id, className: ["code-collapse-label"] }, [
          el(
            "svg",
            {
              className: ["cc-chevron"],
              ariaHidden: "true",
              width: 16,
              height: 16,
              viewBox: "0 0 16 16",
              fill: "none"
            },
            [
              el("path", {
                d: "M4 6l4 4 4-4",
                stroke: "currentColor",
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              })
            ]
          ),
          el("span", { className: ["cc-label-show"] }, [{ type: "text", value: "\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C" }]),
          el("span", { className: ["cc-label-hide"] }, [{ type: "text", value: "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C" }])
        ])
      );
    });
  };
}

// src/styles.ts
var COLLAPSE_CSS = `
figure.code-collapsible { position: relative; }
figure.code-collapsible > input.code-collapse-toggle {
  position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;
}
figure.code-collapsible > pre {
  max-height: 11rem;
  overflow-y: hidden;
  transition: max-height 0.2s ease;
}
figure.code-collapsible::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 5rem;
  background: linear-gradient(to bottom, transparent, var(--panel-bg));
  pointer-events: none;
  border-radius: 0 0 6px 6px;
}
/* \u041A\u043D\u043E\u043F\u043A\u0430-\u0441\u0442\u0440\u0435\u043B\u043A\u0430 \u0432 \u043F\u0440\u0430\u0432\u043E\u043C \u043D\u0438\u0436\u043D\u0435\u043C \u0443\u0433\u043B\u0443 \u043E\u043A\u043D\u0430 \u043A\u043E\u0434\u0430 \u2014 \u0442\u043E\u0442 \u0436\u0435 chrome, \u0447\u0442\u043E \u0438
   \u0443 \u043A\u043D\u043E\u043F\u043A\u0438 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F (.clipboard-button): \u0440\u0430\u043C\u043A\u0430, \u0444\u043E\u043D, \u0440\u0430\u0434\u0438\u0443\u0441, \u043F\u0430\u0434\u0434\u0438\u043D\u0433.
   \u0421\u0442\u0440\u0435\u043B\u043A\u0430 \u0432\u043D\u0438\u0437 = \u0440\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C, \u043F\u0440\u0438 :checked \u043F\u043E\u0432\u043E\u0440\u043E\u0442 \u043D\u0430 180\xB0 = \u0441\u0432\u0435\u0440\u043D\u0443\u0442\u044C.
   \u0412 \u043E\u0442\u043B\u0438\u0447\u0438\u0435 \u043E\u0442 \u043A\u043D\u043E\u043F\u043A\u0438 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F, \u0432\u0438\u0434\u043D\u0430 \u0432\u0441\u0435\u0433\u0434\u0430 (\u044D\u0442\u043E affordance). */
figure.code-collapsible > label.code-collapse-label {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  margin: 0.3rem;
  color: var(--gray);
  border: 1px solid var(--dark);
  background-color: var(--light);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}
figure.code-collapsible > label.code-collapse-label:hover {
  border-color: var(--secondary);
}
figure.code-collapsible > label.code-collapse-label > svg.cc-chevron {
  display: block;
  transition: transform 0.2s ease;
}
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label svg.cc-chevron {
  transform: rotate(180deg);
}
/* \u0422\u0435\u043A\u0441\u0442 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 DOM \u0434\u043B\u044F \u0441\u043A\u0440\u0438\u043D\u0440\u0438\u0434\u0435\u0440\u043E\u0432 (\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0435 \u0438\u043C\u044F label), \u043D\u043E \u0441\u043A\u0440\u044B\u0442
   \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u043E \u2014 \u043D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u0442\u0440\u0435\u043B\u043A\u0430. */
figure.code-collapsible > label.code-collapse-label .cc-label-show,
figure.code-collapsible > label.code-collapse-label .cc-label-hide {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
figure.code-collapsible > label.code-collapse-label .cc-label-hide { display: none; }
/* expanded */
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > pre { max-height: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked)::after { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-show { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-hide { display: inline; }
`;

// src/transformer.ts
var CollapseCode = () => {
  return {
    name: "CollapseCode",
    markdownPlugins() {
      return [remarkCollapseMarker];
    },
    htmlPlugins() {
      return [rehypeCollapseWrap];
    },
    externalResources() {
      return {
        css: [{ content: COLLAPSE_CSS, inline: true }],
        js: []
      };
    }
  };
};

export { CollapseCode };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map