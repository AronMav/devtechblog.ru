import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
  },
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  noExternal: [/.*/],
  external: [
    "preact",
    "preact/hooks",
    "preact/jsx-runtime",
    "preact/compat",
    "@jackyzha0/quartz",
    "@jackyzha0/quartz/*",
    "vfile",
    "vfile/*",
    "unified",
  ],
  outDir: "dist",
  platform: "node",
});
