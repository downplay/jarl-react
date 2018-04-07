import path from "path";
import reactServer from "./reactServer";

const context = {
    basePath: path.resolve(__dirname, ".."),
    name: "JARL demos",
    mode: "production",
    port: 3210,
    staticPath: "dist",
    manifestName: "asset-manifest.json",
    outputPath: "dist"
};

reactServer(context);
