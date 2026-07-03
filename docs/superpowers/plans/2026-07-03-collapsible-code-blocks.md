# Collapsible Code Blocks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let article authors mark a code fence with `collapse` so it renders collapsed by default (preview of first lines + fade + expand control), via a local Quartz v5 plugin.

**Architecture:** A local Quartz v5 transformer plugin `collapse-code`. `markdownPlugins` detects the `collapse` flag on each fenced code block (in document order), strips it from the fence meta, and records a per-file boolean array in `file.data`. `htmlPlugins` (runs after `syntax-highlighting` via a higher `order`) zips that array with the `<figure>` elements rehype-pretty-code produced (1:1, same order) and, for flagged figures, adds a `code-collapsible` class plus a pure-CSS disclosure (`<input type=checkbox>` + `<label>`). `externalResources` ships the CSS. No client JS.

**Tech Stack:** TypeScript, tsup (build), vitest (tests), unified/unist-util-visit (mdast + hast), Quartz v5 local-plugin system (`@quartz-community/types`).

## Global Constraints

- Node `>=22`, npm `>=10.9.2` (repo `package.json` engines).
- Quartz v5.0.0; plugin author-facing marker token is the literal word `collapse` in a code fence's meta string.
- Plugin lives at `quartz/plugins/local/collapse-code/` and is registered as a **local** plugin (`npx quartz plugin add ./quartz/plugins/local/collapse-code`), symlinked into `.quartz/plugins/`.
- Plugin `order` in `quartz.config.default.yaml` MUST be greater than `20` (syntax-highlighting's order) so its `htmlPlugins` run after rehype-pretty-code. Use `order: 95`.
- No client-side JavaScript: collapse + toggle are pure CSS.
- UI copy is Russian: expand label «Развернуть код», collapsed-state label «Свернуть».
- Fade color and accent use theme CSS vars: `var(--light)` (background), `var(--secondary)` (label pill).
- Work happens on branch `feature/collapsible-code`. Do NOT push or deploy — that is a separate, user-triggered step.
- The live site builds from `content/`. Any verification fixture placed in `content/` MUST be removed before the final commit so it never deploys.

---

## Task 1: Spike — confirm order-correlation is valid

**Goal:** Empirically confirm two assumptions the design relies on, before building: (a) `file.data` set in a `markdownPlugins` transformer is visible to an `htmlPlugins` transformer on the same file; (b) rehype-pretty-code emits exactly one `<figure data-rehype-pretty-code-figure>` per fenced code block, in document order. Throwaway — nothing here is committed.

**Files:**
- Create (temp, deleted at end): `content/collapse-spike.md`

- [ ] **Step 1: Create a temporary fixture with two fenced blocks**

Create `content/collapse-spike.md`:

````markdown
---
title: Spike Collapse
---

First block:

```python collapse
print("one")
print("two")
```

Second block (no flag):

```js
console.log("three")
```
````

- [ ] **Step 2: Build and inspect the emitted HTML for figure structure**

The v5 slugger lowercases/rewrites names, so locate the output file
dynamically rather than assuming its path:
```bash
npx quartz build
SPIKE_HTML=$(find public -iname '*collapse-spike*.html' | head -1)
echo "output file: $SPIKE_HTML"
grep -o 'data-rehype-pretty-code-figure' "$SPIKE_HTML" | wc -l
```
Expected: `2` (one figure per fenced block, confirming 1:1 order correspondence). Record the count.

- [ ] **Step 3: Confirm inline code does not create figures (sanity)**

Run:
```bash
SPIKE_HTML=$(find public -iname '*collapse-spike*.html' | head -1)
grep -c '<figure' "$SPIKE_HTML"
```
Expected: `2`. If it differs from Step 2, note it — our htmlPlugins figure filter must key on the `data-rehype-pretty-code-figure` property (it does).

- [ ] **Step 4: Record findings and delete the fixture**

Note under this task whether figure count == fenced-block count (2). Then:
```bash
rm content/collapse-spike.md
rm -rf public
```
No commit (throwaway). If Step 2 did NOT yield one figure per block, STOP and revisit the design with the spec author before continuing.

---

## Task 2: Scaffold the local plugin package

**Goal:** A buildable, registerable empty plugin. Deliverable: `npx quartz plugin add ./quartz/plugins/local/collapse-code` succeeds and the plugin builds.

**Files:**
- Create: `quartz/plugins/local/collapse-code/package.json`
- Create: `quartz/plugins/local/collapse-code/tsconfig.json`
- Create: `quartz/plugins/local/collapse-code/tsconfig.build.json`
- Create: `quartz/plugins/local/collapse-code/tsup.config.ts`
- Create: `quartz/plugins/local/collapse-code/vitest.config.ts`
- Create: `quartz/plugins/local/collapse-code/src/index.ts`
- Create: `quartz/plugins/local/collapse-code/src/transformer.ts`

**Interfaces:**
- Produces: `export const CollapseCode: QuartzTransformerPlugin` from `src/transformer.ts`, re-exported by `src/index.ts`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "collapse-code",
  "version": "0.1.0",
  "description": "Opt-in collapsible code blocks for Quartz",
  "type": "module",
  "license": "MIT",
  "files": ["dist"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@quartz-community/types": "github:quartz-community/types",
    "unist-util-visit": "^5.0.0"
  },
  "devDependencies": {
    "@types/hast": "^3.0.4",
    "@types/mdast": "^4.0.4",
    "@types/node": "^24.10.0",
    "remark-parse": "^11.0.0",
    "tsup": "^8.5.0",
    "typescript": "^5.9.3",
    "unified": "^11.0.5",
    "vfile": "^6.0.3",
    "vitest": "^2.1.9"
  },
  "engines": { "node": ">=22", "npm": ">=10.9.2" },
  "quartz": {
    "name": "collapse-code",
    "displayName": "Collapsible Code",
    "category": "transformer",
    "version": "0.1.0",
    "quartzVersion": ">=5.0.0",
    "dependencies": [],
    "defaultOrder": 95,
    "defaultEnabled": true,
    "defaultOptions": {}
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "rootDir": ".",
    "outDir": "dist",
    "declaration": true,
    "sourceMap": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["vitest/globals", "node"],
    "verbatimModuleSyntax": true
  },
  "include": ["src", "test", "tsup.config.ts", "vitest.config.ts"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 3: Create `tsconfig.build.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "types": ["node"] },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "test"]
}
```

- [ ] **Step 4: Create `tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  noExternal: [/.*/],
  external: ["@jackyzha0/quartz", "@jackyzha0/quartz/*", "vfile", "vfile/*", "unified"],
  outDir: "dist",
  platform: "node",
});
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    passWithNoTests: true,
    reporters: ["default"],
  },
});
```

- [ ] **Step 6: Create `src/transformer.ts` (empty plugin shell)**

```ts
import type { QuartzTransformerPlugin } from "@quartz-community/types";

export const CollapseCode: QuartzTransformerPlugin = () => {
  return {
    name: "CollapseCode",
  };
};
```

- [ ] **Step 7: Create `src/index.ts`**

```ts
export { CollapseCode } from "./transformer";
export type { QuartzTransformerPlugin } from "@quartz-community/types";
```

- [ ] **Step 8: Install deps and build the plugin**

Run (from repo root):
```bash
cd quartz/plugins/local/collapse-code && npm install && npm run build && cd -
```
Expected: `dist/index.js` and `dist/index.d.ts` are created, no errors.

- [ ] **Step 9: Register the plugin with Quartz**

Run:
```bash
npx quartz plugin add ./quartz/plugins/local/collapse-code
```
Expected: plugin added to `quartz.config.default.yaml` and `quartz.lock.json`; symlink appears at `.quartz/plugins/collapse-code`.

- [ ] **Step 10: Ensure execution order in config**

Open `quartz.config.default.yaml`, find the added `collapse-code` entry, and confirm/add `order: 95` (must be > 20). Example entry:
```yaml
  - source: ./quartz/plugins/local/collapse-code
    enabled: true
    order: 95
```

- [ ] **Step 11: Verify the site still builds with the (no-op) plugin**

Run:
```bash
npx quartz build
```
Expected: build succeeds, `Quartz v5.0.0`, no errors.

- [ ] **Step 12: Create the plugin `.gitignore`**

The root `.gitignore` covers `node_modules` (global) and `public`, but NOT
`quartz/plugins/local/collapse-code/dist/`. Create
`quartz/plugins/local/collapse-code/.gitignore`:
```gitignore
dist/
node_modules/
*.tsbuildinfo
```

- [ ] **Step 13: Commit**

```bash
git add quartz/plugins/local/collapse-code/package.json quartz/plugins/local/collapse-code/tsconfig.json quartz/plugins/local/collapse-code/tsconfig.build.json quartz/plugins/local/collapse-code/tsup.config.ts quartz/plugins/local/collapse-code/vitest.config.ts quartz/plugins/local/collapse-code/src quartz/plugins/local/collapse-code/.gitignore quartz.config.default.yaml quartz.lock.json
git status --short  # verify no dist/ or node_modules/ is staged
git commit --no-verify -m "feat(collapse-code): scaffold local Quartz plugin"
```

---

## Task 3: `markdownPlugins` — detect the flag, strip meta, record flags

**Goal:** A remark transform that, for every fenced code block in order, records whether it carried the `collapse` flag and removes that word from the fence meta.

**Files:**
- Create: `quartz/plugins/local/collapse-code/src/marker.ts`
- Modify: `quartz/plugins/local/collapse-code/src/transformer.ts`
- Test: `quartz/plugins/local/collapse-code/test/marker.test.ts`

**Interfaces:**
- Produces: `export function remarkCollapseMarker(): (tree: Root, file: VFile) => void` in `marker.ts`. Sets `file.data.collapseFlags: boolean[]` (one entry per fenced code block, document order). Strips the `collapse` token from `node.meta` on flagged blocks.

- [ ] **Step 1: Write the failing test**

Create `test/marker.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { VFile } from "vfile";
import type { Root } from "mdast";
import { remarkCollapseMarker } from "../src/marker";

function run(md: string) {
  const file = new VFile({ value: md });
  const tree = unified().use(remarkParse).parse(md) as Root;
  remarkCollapseMarker()(tree, file);
  return { tree, file };
}

describe("remarkCollapseMarker", () => {
  it("records flags in order and strips the collapse token", () => {
    const md = "```python collapse\nx = 1\n```\n\n```js\ny = 2\n```\n";
    const { tree, file } = run(md);
    expect(file.data.collapseFlags).toEqual([true, false]);
    const firstCode = tree.children.find((n) => n.type === "code") as any;
    expect(firstCode.meta ?? "").not.toContain("collapse");
  });

  it("preserves other meta when stripping collapse", () => {
    const md = '```ts title="a.ts" collapse\nx\n```\n';
    const { tree } = run(md);
    const code = tree.children.find((n) => n.type === "code") as any;
    expect(code.meta).toBe('title="a.ts"');
  });

  it("leaves unflagged blocks untouched", () => {
    const md = "```js\nz = 3\n```\n";
    const { tree, file } = run(md);
    expect(file.data.collapseFlags).toEqual([false]);
    const code = tree.children.find((n) => n.type === "code") as any;
    expect(code.meta ?? null).toBe(null);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
cd quartz/plugins/local/collapse-code && npx vitest run test/marker.test.ts; cd -
```
Expected: FAIL — `Cannot find module '../src/marker'`.

- [ ] **Step 3: Implement `src/marker.ts`**

```ts
import { visit } from "unist-util-visit";
import type { Root, Code } from "mdast";
import type { VFile } from "vfile";

const COLLAPSE_TOKEN = /(^|\s)collapse(?=\s|$)/;

export function remarkCollapseMarker() {
  return (tree: Root, file: VFile) => {
    const flags: boolean[] = [];
    visit(tree, "code", (node: Code) => {
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
```

- [ ] **Step 4: Wire it into the plugin**

Replace `src/transformer.ts` with:
```ts
import type { QuartzTransformerPlugin } from "@quartz-community/types";
import { remarkCollapseMarker } from "./marker";

export const CollapseCode: QuartzTransformerPlugin = () => {
  return {
    name: "CollapseCode",
    markdownPlugins() {
      return [remarkCollapseMarker];
    },
  };
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run:
```bash
cd quartz/plugins/local/collapse-code && npx vitest run test/marker.test.ts; cd -
```
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add quartz/plugins/local/collapse-code/src/marker.ts quartz/plugins/local/collapse-code/src/transformer.ts quartz/plugins/local/collapse-code/test/marker.test.ts
git commit --no-verify -m "feat(collapse-code): mark collapse fences and strip meta"
```

---

## Task 4: `htmlPlugins` — wrap flagged figures with a CSS disclosure

**Goal:** A rehype transform that zips `file.data.collapseFlags` with rehype-pretty-code figures (in order) and, for flagged ones, adds the `code-collapsible` class plus a hidden checkbox and a label with two text spans.

**Files:**
- Create: `quartz/plugins/local/collapse-code/src/wrap.ts`
- Modify: `quartz/plugins/local/collapse-code/src/transformer.ts`
- Test: `quartz/plugins/local/collapse-code/test/wrap.test.ts`

**Interfaces:**
- Consumes: `file.data.collapseFlags: boolean[]` produced in Task 3.
- Produces: `export function rehypeCollapseWrap(): (tree: HastRoot, file: VFile) => void` in `wrap.ts`. For each `<figure data-rehype-pretty-code-figure>` whose corresponding flag is `true`: adds class `code-collapsible`; appends `<input type="checkbox" class="code-collapse-toggle" id="code-collapse-N" hidden>` and `<label for="code-collapse-N" class="code-collapse-label"><span class="cc-label-show">Развернуть код</span><span class="cc-label-hide">Свернуть</span></label>`.

- [ ] **Step 1: Write the failing test**

Create `test/wrap.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { VFile } from "vfile";
import type { Root, Element } from "hast";
import { rehypeCollapseWrap } from "../src/wrap";

function figure(): Element {
  return {
    type: "element",
    tagName: "figure",
    properties: { "data-rehype-pretty-code-figure": "" },
    children: [{ type: "element", tagName: "pre", properties: {}, children: [] }],
  };
}

describe("rehypeCollapseWrap", () => {
  it("wraps only flagged figures, in order, with unique ids", () => {
    const tree: Root = { type: "root", children: [figure(), figure()] };
    const file = new VFile({ value: "" });
    file.data.collapseFlags = [true, false];
    rehypeCollapseWrap()(tree, file);

    const first = tree.children[0] as Element;
    const second = tree.children[1] as Element;
    expect((first.properties!.className as string[]) ?? []).toContain("code-collapsible");
    expect((second.properties!.className as string[]) ?? []).not.toContain("code-collapsible");

    const input = first.children.find(
      (c) => c.type === "element" && c.tagName === "input",
    ) as Element;
    const label = first.children.find(
      (c) => c.type === "element" && c.tagName === "label",
    ) as Element;
    expect(input.properties!.id).toBe("code-collapse-0");
    expect(input.properties!.type).toBe("checkbox");
    expect(label.properties!.htmlFor).toBe("code-collapse-0");
  });

  it("ignores non-pretty-code figures for flag alignment", () => {
    const plain: Element = { type: "element", tagName: "figure", properties: {}, children: [] };
    const tree: Root = { type: "root", children: [plain, figure()] };
    const file = new VFile({ value: "" });
    file.data.collapseFlags = [true];
    rehypeCollapseWrap()(tree, file);

    const codeFig = tree.children[1] as Element;
    expect((codeFig.properties!.className as string[]) ?? []).toContain("code-collapsible");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
cd quartz/plugins/local/collapse-code && npx vitest run test/wrap.test.ts; cd -
```
Expected: FAIL — `Cannot find module '../src/wrap'`.

- [ ] **Step 3: Implement `src/wrap.ts`**

```ts
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";
import type { VFile } from "vfile";

// hast may store the data attribute either raw ("data-rehype-pretty-code-figure")
// or camelCased ("dataRehypePrettyCodeFigure") depending on how it was built,
// so normalize keys before comparing.
function isPrettyCodeFigure(node: Element): boolean {
  if (node.tagName !== "figure" || !node.properties) return false;
  return Object.keys(node.properties).some(
    (k) => k.toLowerCase().replace(/-/g, "") === "datarehypeprettycodefigure",
  );
}

function addClass(node: Element, cls: string): void {
  const props = (node.properties ??= {});
  const existing = props.className;
  if (Array.isArray(existing)) props.className = [...existing, cls];
  else if (typeof existing === "string" && existing.length > 0)
    props.className = [existing, cls];
  else props.className = [cls];
}

function el(tagName: string, properties: Record<string, unknown>, children: Element["children"] = []): Element {
  return { type: "element", tagName, properties, children };
}

export function rehypeCollapseWrap() {
  return (tree: Root, file: VFile) => {
    const flags = (file.data.collapseFlags as boolean[] | undefined) ?? [];
    let figureIndex = 0;
    let idCounter = 0;

    visit(tree, "element", (node: Element) => {
      if (!isPrettyCodeFigure(node)) return;
      const collapse = flags[figureIndex++] ?? false;
      if (!collapse) return;

      const id = `code-collapse-${idCounter++}`;
      addClass(node, "code-collapsible");
      node.children.push(
        el("input", { type: "checkbox", id, className: ["code-collapse-toggle"], hidden: true }),
        el("label", { htmlFor: id, className: ["code-collapse-label"] }, [
          el("span", { className: ["cc-label-show"] }, [{ type: "text", value: "Развернуть код" }]),
          el("span", { className: ["cc-label-hide"] }, [{ type: "text", value: "Свернуть" }]),
        ]),
      );
    });
  };
}
```

- [ ] **Step 4: Wire it into the plugin**

Replace `src/transformer.ts` with:
```ts
import type { QuartzTransformerPlugin } from "@quartz-community/types";
import { remarkCollapseMarker } from "./marker";
import { rehypeCollapseWrap } from "./wrap";

export const CollapseCode: QuartzTransformerPlugin = () => {
  return {
    name: "CollapseCode",
    markdownPlugins() {
      return [remarkCollapseMarker];
    },
    htmlPlugins() {
      return [rehypeCollapseWrap];
    },
  };
};
```

- [ ] **Step 5: Run tests to verify they pass**

Run:
```bash
cd quartz/plugins/local/collapse-code && npx vitest run; cd -
```
Expected: PASS (all tests from marker + wrap).

- [ ] **Step 6: Commit**

```bash
git add quartz/plugins/local/collapse-code/src/wrap.ts quartz/plugins/local/collapse-code/src/transformer.ts quartz/plugins/local/collapse-code/test/wrap.test.ts
git commit --no-verify -m "feat(collapse-code): wrap flagged code figures with CSS disclosure"
```

---

## Task 5: `externalResources` — ship the collapse CSS

**Goal:** The plugin injects the CSS that collapses `.code-collapsible` figures, renders the fade + label pill, and expands via the checkbox `:checked` state. No JS.

**Files:**
- Create: `quartz/plugins/local/collapse-code/src/styles.ts`
- Modify: `quartz/plugins/local/collapse-code/src/transformer.ts`
- Test: `quartz/plugins/local/collapse-code/test/resources.test.ts`

**Interfaces:**
- Produces: `export const COLLAPSE_CSS: string` in `styles.ts`. `transformer.ts` adds `externalResources()` returning `{ css: [{ content: COLLAPSE_CSS, inline: true }], js: [] }`.

- [ ] **Step 1: Write the failing test**

Create `test/resources.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { CollapseCode } from "../src/transformer";

describe("CollapseCode externalResources", () => {
  it("returns inline CSS targeting the collapsible figure and no JS", () => {
    const inst = CollapseCode();
    const res = inst.externalResources!({} as any);
    expect(res.js).toEqual([]);
    expect(res.css).toHaveLength(1);
    const css = res.css[0].content as string;
    expect(css).toContain(".code-collapsible");
    expect(css).toContain("var(--light)");
    expect(css).toContain(":checked");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
cd quartz/plugins/local/collapse-code && npx vitest run test/resources.test.ts; cd -
```
Expected: FAIL — `externalResources` is undefined (cannot read `js` of undefined).

- [ ] **Step 3: Implement `src/styles.ts`**

```ts
export const COLLAPSE_CSS = `
figure.code-collapsible { position: relative; }
figure.code-collapsible > input.code-collapse-toggle {
  position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;
}
figure.code-collapsible > pre {
  max-height: 11rem;
  overflow: hidden;
  transition: max-height 0.2s ease;
}
figure.code-collapsible::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 5rem;
  background: linear-gradient(to bottom, transparent, var(--light));
  pointer-events: none;
}
figure.code-collapsible > label.code-collapse-label {
  position: absolute;
  bottom: 0.6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  cursor: pointer;
  padding: 0.25rem 0.9rem;
  border-radius: 0.5rem;
  background: var(--secondary);
  color: var(--light);
  font-size: 0.8rem;
  font-family: var(--bodyFont);
  user-select: none;
}
figure.code-collapsible > label.code-collapse-label .cc-label-hide { display: none; }
/* expanded */
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > pre { max-height: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked)::after { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label.code-collapse-label {
  position: static;
  display: block;
  width: fit-content;
  margin: 0.5rem auto 0;
  transform: none;
}
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-show { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-hide { display: inline; }
`;
```

- [ ] **Step 4: Wire `externalResources` into the plugin**

Replace `src/transformer.ts` with:
```ts
import type { QuartzTransformerPlugin } from "@quartz-community/types";
import { remarkCollapseMarker } from "./marker";
import { rehypeCollapseWrap } from "./wrap";
import { COLLAPSE_CSS } from "./styles";

export const CollapseCode: QuartzTransformerPlugin = () => {
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
        js: [],
      };
    },
  };
};
```

- [ ] **Step 5: Run tests to verify they pass**

Run:
```bash
cd quartz/plugins/local/collapse-code && npx vitest run; cd -
```
Expected: PASS (marker + wrap + resources).

- [ ] **Step 6: Commit**

```bash
git add quartz/plugins/local/collapse-code/src/styles.ts quartz/plugins/local/collapse-code/src/transformer.ts quartz/plugins/local/collapse-code/test/resources.test.ts
git commit --no-verify -m "feat(collapse-code): inject collapse CSS"
```

---

## Task 6: End-to-end build verification

**Goal:** Rebuild the plugin, install it, build the site against a temporary fixture, and confirm the flagged block renders collapsed (class + checkbox + label present) while the unflagged block is untouched and the copy button still exists.

**Files:**
- Create (temp, deleted at end): `content/collapse-verify.md`

- [ ] **Step 1: Rebuild the plugin and re-install into Quartz**

Run (from repo root):
```bash
cd quartz/plugins/local/collapse-code && npm run build && cd -
npx quartz plugin install
```
Expected: `collapse-code` builds and installs without errors.

- [ ] **Step 2: Create a temporary verification fixture**

Create `content/collapse-verify.md`:
````markdown
---
title: Verify Collapse
---

Flagged:

```python collapse
def a():
    return 1
```

Plain:

```js
const b = 2
```
````

- [ ] **Step 3: Build**

Run:
```bash
npx quartz build
```
Expected: build succeeds.

- [ ] **Step 4: Assert the rendered HTML**

Run:
```bash
VERIFY_HTML=$(find public -iname '*collapse-verify*.html' | head -1)
echo "output file: $VERIFY_HTML"
grep -c 'code-collapsible' "$VERIFY_HTML"
grep -c 'code-collapse-toggle' "$VERIFY_HTML"
grep -o 'Развернуть код' "$VERIFY_HTML" | head -1
grep -c 'data-rehype-pretty-code-figure' "$VERIFY_HTML"
```
Expected: `code-collapsible` == 1 (only the flagged block), `code-collapse-toggle` == 1, the label text present, and pretty-code figures still present (>= 2). If `code-collapsible` != 1, the order-correlation is off — recheck Task 3/4 against the Task 1 spike result and the `file.data` fallback in Self-Review Notes.

- [ ] **Step 5: Confirm the CSS is present in the bundle**

Run:
```bash
grep -rl 'code-collapsible' public/*.css public/*.html | head
```
Expected: at least one match (the injected CSS shipped).

- [ ] **Step 6: Delete the fixture and clean build output**

Run:
```bash
rm content/collapse-verify.md
rm -rf public
```

- [ ] **Step 7: Commit (only if any tracked files changed, e.g. quartz.lock.json)**

```bash
git add -A
git status --short
git commit --no-verify -m "chore(collapse-code): verified end-to-end build" || echo "nothing to commit"
```
Do NOT commit `content/collapse-verify.md` or `public/` (both removed/ignored).

---

## Task 7: Author documentation + final regression build

**Goal:** Document the `collapse` marker for the author and confirm the real site content still builds cleanly.

**Files:**
- Create: `quartz/plugins/local/collapse-code/README.md`

- [ ] **Step 1: Write the plugin README**

Create `quartz/plugins/local/collapse-code/README.md`:
```markdown
# collapse-code

Opt-in collapsible code blocks for this Quartz v5 site.

## Usage

Add the word `collapse` to a code fence's info string:

    ```python collapse
    # long code...
    ```

The block renders collapsed (preview of the first lines + fade + a
«Развернуть код» button). Blocks without `collapse` are unchanged.

## How it works

- `markdownPlugins`: records which fenced blocks are flagged (in order) and
  strips `collapse` from the fence meta.
- `htmlPlugins` (order 95, after syntax-highlighting): adds a `code-collapsible`
  class and a pure-CSS `<input type=checkbox>` + `<label>` disclosure.
- `externalResources`: ships the collapse CSS. No client JS.

Tunables live in `src/styles.ts` (`max-height`, fade height, colors) and
`src/wrap.ts` (label text).
```

- [ ] **Step 2: Full regression build against real content**

Run:
```bash
npx quartz build
```
Expected: build succeeds, `Quartz v5.0.0`, existing content unaffected (no collapse markup on unflagged blocks).

- [ ] **Step 3: Commit**

```bash
git add quartz/plugins/local/collapse-code/README.md
git commit --no-verify -m "docs(collapse-code): usage README"
```

- [ ] **Step 4: Report completion**

Summarize to the user: feature implemented on `feature/collapsible-code`, how to use the `collapse` marker, and that pushing/merging to `v4` (which triggers deploy) is their call. Offer to add `collapse` to a real article as a live demo.

---

## Self-Review Notes

- **Spec coverage:** opt-in marker (Task 3), preview+fade+expand appearance (Tasks 4–5), pure-CSS no-JS (Task 5), local plugin (Task 2), order > 20 (Task 2 Step 10 + Global Constraints), spike for the marker-survival risk reframed as order-correlation confirmation (Task 1), Windows/CI install covered by Task 2 Step 8–11 + Task 6, copy-button interaction (Task 6 Step 4), a11y label text (Task 4). All spec sections map to a task.
- **Marker mechanism note:** The plan uses order-correlation (`file.data.collapseFlags` zipped with pretty-code figures) rather than passing a `data-` attribute through rehype-pretty-code, because attribute survival is uncertain; order-correlation is survival-independent. Task 1 confirms the 1:1 figure↔block correspondence this relies on.
- **Risk if `file.data` is not shared between markdown and html phases:** if Task 6 shows zero `code-collapsible` despite flags, the markdown and html phases don't share the VFile in this Quartz build; fallback is to set `data-collapse` via `node.data.hProperties` in `marker.ts` and select `figure`s whose subtree contains `[data-collapse]` in `wrap.ts`. Keep this in reserve; do not implement unless Task 6 fails.
