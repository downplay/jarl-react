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
                let source = fs.readFileSync(filePath, "utf-8");
                if (/\.tsx?$/.test(filePath)) {
                    // react-docgen@2's bundled `babylon` parser predates both TypeScript
                    // (it only understands Flow-annotated JS) and any JS syntax newer than
                    // ~2017 (e.g. optional chaining), so it can't parse these files
                    // directly post-conversion. Strip types and down-level modern syntax
                    // first (preserving JSX so react-docgen can still find component
                    // definitions) rather than upgrading react-docgen itself, which has a
                    // materially different API in later majors. Uses Babel rather than the
                    // `typescript` package: TypeScript 7's public API is now the native/Go
                    // compiler, which no longer exposes a `transpileModule`-style function.
                    // eslint-disable-next-line global-require
                    const babel = require("@babel/core");
                    source = babel.transformSync(source, {
                        filename: filePath,
                        presets: [
                            ["@babel/preset-typescript"],
                            [
                                "@babel/preset-env",
                                {
                                    // A target new enough to leave ES6 classes and spread
                                    // syntax untouched (react-docgen's resolver looks for
                                    // the literal `class X extends React.Component` AST
                                    // shape, and downleveling spread-in-super requires
                                    // downleveling classes too) but old enough that
                                    // optional chaining/nullish coalescing - which
                                    // react-docgen's ancient bundled parser predates - still
                                    // get compiled down to something it can parse.
                                    targets: "chrome 79",
                                    modules: false,
                                },
                            ],
                        ],
                        plugins: ["@babel/plugin-syntax-jsx"],
                        babelrc: false,
                        configFile: false,
                        retainLines: true,
                    }).code;
                }
                const componentInfo = reactDocs.parse(source, findAllComponentDefinitions);
                return `export default ${JSON.stringify(componentInfo)};`;
            }
            return null;
        },
    };
};
