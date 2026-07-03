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
