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
