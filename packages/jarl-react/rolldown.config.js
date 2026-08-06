import { defineConfig } from "rolldown";

export default defineConfig({
    input: "source/index.js",
    external: ["react", "prop-types"],
    moduleTypes: {
        ".js": "jsx",
    },
    output: [
        { file: "dist/index.cjs", format: "cjs", exports: "named" },
        { file: "dist/index.mjs", format: "esm" },
    ],
});
