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
