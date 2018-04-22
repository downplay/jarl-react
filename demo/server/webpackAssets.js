import path from "path";
import fs from "fs-extra";

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function parseWebpackAssetManifest({
    basePath,
    outputPath,
    manifestName
}) {
    const MAX_TRIES = 10;
    const assetManifest = path.join(basePath, outputPath, manifestName);
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

const withPath = asset => `/${asset}`;

async function webpackAssets(context) {
    const assets = await parseWebpackAssetManifest(context);

    const reduce = (...list) =>
        list.reduce((acc, val) => {
            if (assets[val]) {
                acc.push(withPath(assets[val]));
            }
            return acc;
        }, []);

    return {
        scripts: reduce("vendors~bundle.js", "bundle.js"),
        styles: reduce("vendors~bundle.css", "bundle.css")
    };
}

export default webpackAssets;
