const fs = require("fs");

// Vite plugin equivalent of the old webpack inline loaders
// (documentationLoader.js / reactDocgenLoader.js) that generated API
// doc JSON from the library source at build time. Imports opt in with a
// `documentation-loader:` or `react-docgen-loader:` prefix, e.g.:
//
//   import JarlApi from "documentation-loader:../../../packages/jarl-react/source/index";
//
// See source/docs/api/index.js for the consuming code.

const DOC_PREFIX = "documentation-loader:";
const DOCGEN_PREFIX = "react-docgen-loader:";

module.exports = function jarlDocsLoaderPlugin() {
    return {
        name: "jarl-docs-loader",
        async resolveId(source, importer) {
            const prefix = [DOC_PREFIX, DOCGEN_PREFIX].find((p) => source.startsWith(p));
            if (!prefix) {
                return null;
            }
            const target = source.slice(prefix.length);
            const resolved = await this.resolve(target, importer, {
                skipSelf: true,
            });
            if (!resolved) {
                return null;
            }
            return `${prefix}${resolved.id}`;
        },
        async load(id) {
            if (id.startsWith(DOC_PREFIX)) {
                // eslint-disable-next-line global-require
                const documentation = require("documentation");
                const filePath = id.slice(DOC_PREFIX.length);
                const output = await documentation
                    .build([filePath], {})
                    .then(documentation.formats.json);
                return `export default ${output};`;
            }
            if (id.startsWith(DOCGEN_PREFIX)) {
                // eslint-disable-next-line global-require
                const reactDocs = require("react-docgen");
                // eslint-disable-next-line global-require
                const { findAllComponentDefinitions } = require("react-docgen/dist/resolver");
                const filePath = id.slice(DOCGEN_PREFIX.length);
                const source = fs.readFileSync(filePath, "utf-8");
                const componentInfo = reactDocs.parse(source, findAllComponentDefinitions);
                return `export default ${JSON.stringify(componentInfo)};`;
            }
            return null;
        },
    };
};
