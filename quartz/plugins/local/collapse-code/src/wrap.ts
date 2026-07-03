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
