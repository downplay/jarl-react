import { createRequire } from "module";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import jarlDocsLoaderPlugin from "./tools/jarlDocsLoaderPlugin";
import jsxInJsPlugin from "./tools/jsxInJsPlugin";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

const jarlVersion = process.env.JARL_VERSION
    ? process.env.JARL_VERSION
    : `v${packageJson.version}${
          process.env.JARL_BUILD_NUMBER ? `-${process.env.JARL_BUILD_NUMBER}` : ""
      }`;

export default defineConfig({
    plugins: [jsxInJsPlugin(), react(), jarlDocsLoaderPlugin()],
    server: {
        port: 3210,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        // The default lightningcss minifier chokes on some legacy selector
        // syntax shipped in semantic-ui-css's vendored CSS, so leave CSS
        // unminified rather than pull in a second CSS minifier just for a
        // demo/docs build.
        cssMinify: false,
    },
    define: {
        "process.env.JARL_VERSION": JSON.stringify(jarlVersion),
    },
});
