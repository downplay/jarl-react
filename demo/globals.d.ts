// Ambient module/global declarations for the demo app's untyped dynamic boundaries:
// webpack loader-injected module specifiers and globals, and a handful of very old
// (2018-era) packages that never shipped types and have no accurate `@types/*` for
// the pinned versions in use here. Declared loosely (`any`) rather than depending on
// mismatched upstream types - see packages/jarl-react-native/react-native.d.ts for
// the same pattern used elsewhere in this port.

// Webpack inline-loader import specifiers, e.g. `import x from "!!raw-loader!./Foo"`
// or `import x from "!!./someLoader!../path/to/module"`. These are resolved by
// webpack's loader chain at build time, not by TS/Node module resolution.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module "!!*" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

// Markdown files loaded via raw-loader (webpackConfig.js's `/\.md$/` rule).
declare module "*.md" {
    const content: string;
    export default content;
}

// CSS files loaded via style-loader/css-loader for their side effects, or (in the
// `Highlight` component's prismjs theme imports) also as plain side-effect imports.
declare module "*.css" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

// Binary assets loaded via file-loader (webpackConfig.js's file-loader rule);
// resolves to the emitted asset URL at runtime.
declare module "*.pdf" {
    const content: string;
    export default content;
}

// Webpack `output.publicPath` runtime-configurable global, set in source/index.js.
declare let __webpack_public_path__: string;

// react-emotion@8 (styled-components-style default export: callable as
// `styled('div')`/`styled(Component)`, and also has tag properties like
// `styled.div`). No types were ever published for this old emotion 8 API.
declare module "react-emotion" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const styled: any;
    export default styled;
}

// emotion-theming@8 - old pre-emotion-10 ThemeProvider, untyped.
declare module "emotion-theming" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const ThemeProvider: any;
}

// react-remarkable - untyped markdown renderer component.
declare module "react-remarkable" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Markdown: any;
    export default Markdown;
}

// react-helmet@5 (pinned here) predates this project's TS port; the only published
// types are @types/react-helmet@6.x, targeting a later major with a changed internal
// (not usage) API. Declared loosely rather than depending on a mismatched major.
declare module "react-helmet" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Helmet: any;
    export default Helmet;
}

// prismjs's individual per-language component files (e.g. `prismjs/components/prism-jsx`)
// are imported purely for their side effect of registering a language with the shared
// `Prism` instance from the `prismjs` main import - @types/prismjs only types the main
// entrypoint, not these subpath modules.
declare module "prismjs/components/*" {
    const registerLanguage: undefined;
    export default registerLanguage;
}

// react-pdf-js - untyped PDF viewer component.
declare module "react-pdf-js" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PDF: any;
    export default PDF;
}

// semantic-ui-react@0.79 (2018) predates this library shipping its own types.
// Only the members actually used by the demo are declared.
declare module "semantic-ui-react" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Menu: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Header: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Label: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Segment: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Table: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Button: any;
}

// webpack 4 and its plugin/middleware ecosystem, as used by demo/server and
// demo/build - out of scope to accurately type (webpack config files are a
// documented `any` boundary for this port), and `@types/webpack` targets a much
// newer webpack major than the ^4.6.0 pinned here.
declare module "webpack" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webpack: any;
    export default webpack;
}
declare module "webpack-manifest-plugin" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ManifestPlugin: any;
    export default ManifestPlugin;
}
declare module "extract-text-webpack-plugin" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ExtractTextPlugin: any;
    export default ExtractTextPlugin;
}
declare module "webpack-bundle-analyzer" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const BundleAnalyzerPlugin: any;
}
declare module "webpack-dev-middleware" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webpackDevMiddleware: any;
    export default webpackDevMiddleware;
}
declare module "webpack-hot-middleware" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webpackHotMiddleware: any;
    export default webpackHotMiddleware;
}

// react-hot-loader@4 - untyped in this old version.
declare module "react-hot-loader" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const hot: any;
}

// Cypress 2.x (2017) predates Cypress's own bundled TypeScript support, and this
// project's Cypress suite is slated for replacement by Playwright in a sibling
// ticket, so it's not worth pulling in an approximate modern `@types/cypress` for
// the ancient v2 API surface. `describe`/`it` come from `@types/jest`'s globals
// (structurally compatible enough for these test files); `cy`/`Cypress` are
// declared loosely here purely so the (never type-checked-for-behavior) test files
// compile.
declare const cy: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Cypress: any;
