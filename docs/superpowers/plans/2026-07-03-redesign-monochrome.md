# Engineering Monochrome Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin devtechblog.ru into "engineering monochrome" (graphite/paper + cobalt accent, both themes), drop the border theme and webfonts, disable graph/reader-mode/backlinks.

**Architecture:** Two-file surface, no Quartz source patches: palettes/fontOrigin/plugin toggles in `quartz.config.default.yaml`; font stacks and all character details (mono chrome labels, hairlines, code panels) in `quartz/styles/custom.scss` (the stock customization hook, currently empty). Font loading is killed at the core level (`fontOrigin: local` — verified: `Head.tsx:52` only injects the Google `<link>` when `cdnCaching && fontOrigin === "googleFonts"`; `componentResources.ts:283` skips fetching for `local`).

**Tech Stack:** Quartz v5.0.0, SCSS, YAML config.

## Global Constraints

- Branch: `feature/redesign-monochrome` (already checked out). Do NOT push or deploy — user-triggered separately.
- Spec: `docs/superpowers/specs/2026-07-03-redesign-monochrome-design.md`. Palette hex values below are copied from it verbatim and are binding.
- Only `quartz.config.default.yaml` and `quartz/styles/custom.scss` change. No edits under `quartz/` sources or `quartz/plugins/local/collapse-code/`.
- Zero webfont loading: built HTML must contain no `fonts.googleapis.com` / `fonts.gstatic.com` references.
- No box-shadows, no gradients (except the existing collapse-code fade), border-radius ≤ 6px.
- Dark-mode selector in CSS is `:root[saved-theme="dark"]`.
- The uncommitted content edit in `content/5.2.1 …/1.Подготовка среды.md` is the user's unrelated work: never stage, commit, or revert it.
- Verification fixtures placed in `content/` MUST be deleted before committing.

---

## Task 1: Config — palettes, local fonts, plugin cleanup

**Files:**
- Modify: `quartz.config.default.yaml`

**Interfaces:**
- Produces: Quartz CSS vars (`--light`, `--lightgray`, `--gray`, `--darkgray`, `--dark`, `--secondary`, `--tertiary`) carrying the new palette — Task 2's SCSS relies on these exact vars; plugins `graph`, `reader-mode`, `backlinks`, `fonts` disabled; `quartz-themes` removed.

- [ ] **Step 1: Replace the theme block**

In `quartz.config.default.yaml`, replace the current `theme:` block (from `theme:` through the end of `textHighlight` in `darkMode`) with:

```yaml
  theme:
    fontOrigin: local
    cdnCaching: false
    typography:
      title: Segoe UI
      header: Segoe UI
      body: Segoe UI
      code: Cascadia Code
    colors:
      lightMode:
        light: "#F7F8F9"
        lightgray: "#DCDFE3"
        gray: "#6A727B"
        darkgray: "#1D2126"
        dark: "#101317"
        secondary: "#2B5FC7"
        tertiary: "#1E4CAB"
        highlight: rgba(43, 95, 199, 0.08)
        textHighlight: rgba(43, 95, 199, 0.15)
      darkMode:
        light: "#16181B"
        lightgray: "#2C3136"
        gray: "#8B949C"
        darkgray: "#DFE3E7"
        dark: "#F2F4F6"
        secondary: "#7DA6FF"
        tertiary: "#9DBCFF"
        highlight: rgba(125, 166, 255, 0.10)
        textHighlight: rgba(125, 166, 255, 0.22)
```

(Indentation: `theme:` sits at 2 spaces under `configuration:` — keep the file's existing indent style.)

- [ ] **Step 2: Remove the quartz-themes plugin entry**

Delete this whole block from the `plugins:` list:

```yaml
  - source:
      name: quartz-themes
      repo: github:saberzero1/quartz-themes
      subdir: plugin
    enabled: true
    options:
      theme: border
      mode: both
    order: 95
```

- [ ] **Step 3: Disable fonts, graph, reader-mode, backlinks**

Set `enabled: false` on these four entries (keep their other keys — `layout`, `order` — untouched):

```yaml
  - source: github:quartz-community/fonts
    enabled: false
```
```yaml
  - source: github:quartz-community/graph
    enabled: false
    layout:
      position: right
      priority: 10
```
```yaml
  - source: github:quartz-community/reader-mode
    enabled: false
    layout:
      position: left
      priority: 35
      group: toolbar
```
```yaml
  - source: github:quartz-community/backlinks
    enabled: false
    layout:
      position: right
      priority: 50
```

- [ ] **Step 4: Build and verify**

```bash
npx quartz build
```
Expected: `Quartz v5.0.0`, exit 0.

If the build FAILS with an error mentioning `reader-mode` in `layout.byPageType` (the `folder:`/`tag:` sections have `exclude: [reader-mode]`), remove those two `- reader-mode` exclude lines and rebuild. If it builds, leave them.

Then verify:
```bash
grep -rl 'fonts.googleapis\|fonts.gstatic' public/ | head    # expected: EMPTY
grep -rl 'accent-dark-h' public/ | head                       # expected: EMPTY (border theme gone)
grep -ril 'pixi' public/*.js 2>/dev/null | head               # expected: EMPTY (graph gone)
grep -o 'code-collapse-label' public/index.html | head -1     # collapse CSS still shipped? see note
```
Note: `code-collapse-label` lives in inline CSS on pages with flagged code blocks only; real content currently has none, so an empty result here is fine — Task 3 verifies collapse with a fixture.

- [ ] **Step 5: Commit**

```bash
rm -rf public
git add quartz.config.default.yaml
git commit --no-verify -m "feat(design): monochrome palettes, local fonts, drop border theme, disable graph/reader-mode/backlinks"
```

---

## Task 2: custom.scss — font stacks and character details

**Files:**
- Modify: `quartz/styles/custom.scss` (currently only the variables import + comment)

**Interfaces:**
- Consumes: Quartz CSS vars set by Task 1 (`--light`, `--lightgray`, `--gray`, `--dark`, `--secondary`); component classes `.page-title`, `.page-header`, `.breadcrumb-container`, `.breadcrumb-element`, `.content-meta`, `figure[data-rehype-pretty-code-figure]`; dark selector `:root[saved-theme="dark"]`.

- [ ] **Step 1: Write custom.scss**

Replace the entire contents of `quartz/styles/custom.scss` with:

```scss
@use "./variables.scss" as *;

// ─── Инженерный монохром ────────────────────────────────────────────
// Спека: docs/superpowers/specs/2026-07-03-redesign-monochrome-design.md

// Шрифты: системные стеки, ноль веб-шрифтов (fontOrigin: local в конфиге)
:root {
  --titleFont: "Segoe UI", system-ui, Roboto, Arial, sans-serif;
  --headerFont: "Segoe UI", system-ui, Roboto, Arial, sans-serif;
  --bodyFont: "Segoe UI", system-ui, Roboto, Arial, sans-serif;
  --codeFont: "Cascadia Code", ui-monospace, "JetBrains Mono", Consolas, monospace;
}

// Шапка сайта: mono, капс, разрядка; линейка под шапкой
.page-title {
  font-family: var(--codeFont);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  a {
    color: var(--dark);
  }
}

.page-header {
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 0.8rem;
}

// Хлебные крошки — mono-«бровка» над заголовком
.breadcrumb-container {
  font-family: var(--codeFont);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  .breadcrumb-element p {
    color: var(--gray);
  }
}

// Меты статьи (дата, время чтения): mono, приглушённо
.content-meta {
  font-family: var(--codeFont);
  font-size: 0.74rem;
  color: var(--gray);
}

// Заголовки
h1 {
  text-wrap: balance;
  font-weight: 700;
}

article h2,
.center h2 {
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 0.4rem;
}

// Код-блоки: панель на полтона от фона, бордер 1px, радиус ≤ 6px
figure[data-rehype-pretty-code-figure] > pre {
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background-color: #eef0f2;
}

:root[saved-theme="dark"] figure[data-rehype-pretty-code-figure] > pre {
  background-color: #1d2126;
}

// Ссылки: тонкое подчёркивание с отступом
.center a {
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

// Футер: линейка сверху, mono, мелко
footer {
  border-top: 1px solid var(--lightgray);
  padding-top: 0.8rem;
  font-family: var(--codeFont);
  font-size: 0.72rem;
}
```

- [ ] **Step 2: Build and verify the CSS landed**

```bash
npx quartz build
grep -l 'letter-spacing' public/index-*.css public/*.css 2>/dev/null | head -1   # expected: a css file
grep -o 'Cascadia Code' public/*.css | head -1                                    # expected: match
grep -rl 'fonts.googleapis' public/ | head                                        # expected: EMPTY still
```

- [ ] **Step 3: Commit**

```bash
rm -rf public
git add quartz/styles/custom.scss
git commit --no-verify -m "feat(design): system font stacks and monochrome character in custom.scss"
```

---

## Task 3: End-to-end verification — both themes, collapse, weight

**Files:**
- Create (temp, deleted at end): `content/redesign-check.md`

- [ ] **Step 1: Create fixture with a collapsed code block**

Create `content/redesign-check.md`:

````markdown
---
title: Redesign Check
---

Проверка стиля: [ссылка](https://example.com), `inline код`.

## Раздел с линейкой

```python collapse
def a():
    return 1
```

```js
const b = 2
```
````

- [ ] **Step 2: Build and assert**

```bash
npx quartz build
H=$(find public -iname '*redesign-check*.html' | head -1)
echo "file: $H"
grep -c 'code-collapsible' "$H"          # expected: 1 (collapse works on new skin)
grep -o 'Развернуть код' "$H" | head -1  # expected: match
grep -o '#2B5FC7\|#2b5fc7' public/*.css | head -1   # expected: light accent present
grep -o '#7DA6FF\|#7da6ff' public/*.css | head -1   # expected: dark accent present
```

- [ ] **Step 3: Measure CSS weight (spec budget: ~30 KB total vs ~700 KB before)**

```bash
find public -name '*.css' -exec du -b {} + | sort -n
find public -name '*.css' -exec du -cb {} + | tail -1   # TOTAL — expect well under 100 KB
```
Record the total in the report. If total exceeds 100 KB, investigate what still ships (was: border theme resource-style ~688 KB — must be gone).

- [ ] **Step 4: OG images still generate (spec R2)**

```bash
find public -path '*static*og*' -o -name '*og-image*' | head -3
```
Expected: og-image assets exist (the plugin renders with its own bundled fonts; build success in Task 1/2 already implies no crash — this confirms output).

- [ ] **Step 5: Clean up fixture**

```bash
rm content/redesign-check.md
rm -rf public
git status --short   # only the user's 1С content edit may remain modified
```

- [ ] **Step 6: Serve for the user's visual check (do not commit anything here)**

Report completion and offer: `npx quartz build --serve` so the user can eyeball both themes (toggle in the toolbar), the collapse pill, explorer/search/TOC without graph and backlinks. Deploy remains the user's call.

---

## Self-Review Notes

- **Spec coverage:** palettes → Task 1 Step 1; zero webfonts → Task 1 (fontOrigin local + fonts plugin off) verified by greps; border theme removal (R3) → Task 1 Steps 2/4; layout cleanup → Task 1 Step 3; typography + character details → Task 2; collapse pill both themes (R4) → Task 3 Steps 1–2 (pill uses `var(--secondary)`/`var(--light)` so palette flows in automatically); og-image (R2) → Task 3 Step 4; weight budget → Task 3 Step 3; explorer/search sanity (R5) → Task 3 Step 6 (visual, user-facing).
- **Known conditional:** `layout.byPageType` `exclude: [reader-mode]` may or may not tolerate a disabled plugin — Task 1 Step 4 handles both outcomes explicitly.
- **Type consistency:** class names (`.page-title`, `.breadcrumb-container`, `.content-meta`) were extracted from the installed plugin sources; dark selector `:root[saved-theme="dark"]` matches the pattern used by Quartz themes CSS.
