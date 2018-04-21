import fs from "fs-extra";
import path from "path";

import webpack from "webpack";

import webpackConfigClient from "../server/webpackConfigClient";
import renderHtml from "../server/renderHtml";
import webpackAssets from "../server/webpackAssets";

const packageJson = require("../package.json");

if (
    process.env.JARL_VERSION &&
    process.env.JARL_VERSION !== `v${packageJson.version}`
) {
    throw new Error("Git tag mismatch with package.json version");
}

const context = {
    mode: "production",
    name: "JARL demos",
    basePath: path.resolve(__dirname, ".."),
    outputPath: "dist",
    manifestName: "asset-manifest.json",
    env: {
        JARL_VERSION: process.env.JARL_VERSION
            ? process.env.JARL_VERSION
            : `v${packageJson.version}-${process.env.JARL_BUILD_NUMBER}`
    }
};

const webpackConfig = webpackConfigClient(context);
const distPath = path.resolve(context.basePath, "dist");

fs.emptyDirSync(distPath);

const writeHtml = async () => {
    const assets = await webpackAssets(context);
    const html = renderHtml(assets);
    await fs.writeFile(path.resolve(distPath, "index.html"), html);
};

/* eslint-disable no-console */
webpack(webpackConfig, async (err, stats) => {
    if (err) {
        console.error(err);
    } else if (stats.hasErrors()) {
        console.log(stats.toString("normal"));
        console.error("Build had errors!");
    } else {
        console.log(stats.toString("minimal"));
        console.log("Build OK.");
        if (stats.hasWarnings()) {
            console.log("(There were warnings...)");
        }
        try {
            await writeHtml(context);
        } catch (error) {
            console.error("Failed to write HTML file!");
            console.error(error);
        }
    }
});
