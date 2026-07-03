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
