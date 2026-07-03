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
