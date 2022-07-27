import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/**/*.ts"],
    outDir: "dist",
    clean: true,
    format: ["esm"],
    shims: true,
    splitting: false,
    bundle: false,
    dts: options.watch ? false : { entry: "src/core/lib/index.ts" },
}));
