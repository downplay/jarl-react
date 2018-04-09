import path from "path";
import reactServer from "./reactServer";

// In CI our server process needs to have a title so we can
// kill it from the command line after running E2E
process.title = "JARLDEMO";

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
