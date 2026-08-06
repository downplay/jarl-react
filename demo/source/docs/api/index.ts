// The `documentationLoader`/`reactDocgenLoader` webpack loaders (kept as plain
// `.js` since webpack's loader-runner `require()`s them directly, with zero
// TypeScript awareness) produce dynamically-shaped tool output, so everything
// derived from them here is typed `any` - a deliberate dynamic-boundary choice.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { flatten } from "ramda";

// Process API with documentation.js
//
// These are all loaded via webpack inline-loader syntax (`!!loader!path`), which
// produces build-time-generated JSON/docgen output, not the actual module at
// `path` - so they're typed via `require()` (which TS types as `any` through
// @types/node) rather than `import ... from`. This is deliberate, not just a
// style choice: under TS7's "bundler" module resolution, when `node_modules`
// exists (as it does for any real install of this project), a static `import`
// of an inline-loader specifier like this resolves to the *actual* file at
// `path` for type-checking purposes (ignoring the loader prefix and the
// `declare module "!!*"` ambient wildcard in demo/globals.d.ts), rather than
// erroring or falling back to that wildcard as expected. That's harmless when
// the real file happens to have a compatible-shaped default export, but wrong
// here since the real runtime value (docgen JSON) has nothing to do with the
// statically-resolved module's exports. `require()` sidesteps that resolution
// path entirely.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JarlApi: any = require("!!./documentationLoader!../../../../packages/jarl-react/source/index");

// Process components with docgen
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JarlRoutingProvider: any = require("!!./reactDocgenLoader!../../../../packages/jarl-react/source/RoutingProvider");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JarlStateProvider: any = require("!!./reactDocgenLoader!../../../../packages/jarl-react/source/StateProvider");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JarlRouter: any = require("!!./reactDocgenLoader!../../../../packages/jarl-react/source/Router");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JarlLink: any = require("!!./reactDocgenLoader!../../../../packages/jarl-react/source/Link");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const JarlNativeProvider: any = require("!!./reactDocgenLoader!../../../../packages/jarl-react-native/NativeProvider");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JarlNativeLink: any = require("!!./reactDocgenLoader!../../../../packages/jarl-react-native/Link");

// Blacklist anything that we'll get from react-docs
const blacklistNames = [
    // TODO: Do list all the actions but do it in a better form
    "ACTION_INITIAL",
    "ACTION_RELOAD"
];

// Note: `packages/jarl-react`'s source files were renamed from `.js` to `.ts`/
// `.tsx` by a prior conversion. This blacklist still matches against the old
// `.js` suffix, so (as a straight port) it's preserved verbatim rather than
// "fixed" here - the practical effect is these files would no longer get
// filtered out of the generated API docs, a pre-existing-shaped issue rather
// than something introduced by this conversion.
const blacklistFiles = ["RoutingProvider", "Link", "Router", "StateProvider"];

const mapComponents = (list: any[]) =>
    flatten(list).map((component: any) => ({ ...component, kind: "component" }));

export default {
    "jarl-react": mapComponents([
        JarlRoutingProvider,
        JarlStateProvider,
        JarlRouter,
        JarlLink
    ]).concat(
        JarlApi.filter(
            ({ name, context: { file } }: any) =>
                blacklistNames.indexOf(name) === -1 &&
                !blacklistFiles.some(
                    (fileName: string) => file.indexOf(`/${fileName}.js`) !== -1
                )
        )
    ),
    "jarl-react-native": mapComponents([JarlNativeProvider, JarlNativeLink])
};
