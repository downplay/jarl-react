import fs from "fs-extra";
import path from "path";

import webpack from "webpack";

import webpackConfigClient from "../server/webpackConfigClient";

const webpackConfig = webpackConfigClient({
    mode: "production",
    name: "JARL demos",
    basePath: path.resolve(__dirname, ".."),
    outputPath: "dist",
    manifestName: "asset-manifest.json"
});

fs.emptyDirSync(path.resolve(__dirname, "../dist"));

/* eslint-disable no-console */
webpack(webpackConfig, (err, stats) => {
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
    }
});
