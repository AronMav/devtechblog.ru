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
