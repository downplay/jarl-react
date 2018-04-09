import path from "path";

import webpackConfig from "./webpackConfigClient";
import reactServer from "./reactServer";

const packageJson = require("../package.json");

const context = {
    basePath: path.resolve(__dirname, ".."),
    name: "JARL demos",
    mode: process.env.NODE_ENV || "development",
    port: 3210,
    hmrPath: "__wat",
    manifestName: "asset-manifest.json",
    outputPath: "dist",
    env: {
        JARL_VERSION: packageJson.version
    }
};

context.webpackConfig = webpackConfig(context);

reactServer(context);
