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
