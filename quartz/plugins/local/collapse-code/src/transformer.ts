import type { QuartzTransformerPlugin } from "@quartz-community/types";

export const CollapseCode: QuartzTransformerPlugin = () => {
  return {
    name: "CollapseCode",
  };
};
