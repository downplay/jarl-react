import { defineConfig } from "rolldown";

export default defineConfig({
    input: "source/index.js",
    external: ["react", "prop-types", "jarl-react"],
    moduleTypes: {
        ".js": "jsx",
    },
    output: [
        { file: "dist/index.cjs", format: "cjs", exports: "named" },
        { file: "dist/index.mjs", format: "esm" },
    ],
});
