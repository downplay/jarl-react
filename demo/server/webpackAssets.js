import path from "path";
import fs from "fs-extra";

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function parseWebpackAssetManifest({
    basePath,
    buildPath,
    manifestName
}) {
    const MAX_TRIES = 10;
    const assetManifest = path.join(basePath, buildPath, manifestName);
    let tries = 0;
    while (tries < MAX_TRIES) {
        if (await fs.exists(assetManifest)) {
            return JSON.parse(await fs.readFile(assetManifest));
        }
        // eslint-disable-next-line no-console
        console.log(`Waiting for manifest... ${assetManifest}`);
        await wait(1000);
        tries++;
    }
    return {};
}

function filterExtension(assets, extension) {
    return Object.values(assets)
        .filter(a => a.match(new RegExp(`\\.${extension}$`)))
        .map(s => `/scripts/${s}`);
}

async function webpackAssets(context) {
    const assets = await parseWebpackAssetManifest(context);

    return {
        scripts: filterExtension(assets, "js"),
        styles: filterExtension(assets, "css")
    };
}

export default webpackAssets;
