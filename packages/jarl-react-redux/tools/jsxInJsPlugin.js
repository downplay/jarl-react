import { transformWithOxc } from "vite";

// Vite/vitest (backed by rolldown-vite's oxc transform) only allows JSX
// syntax in .jsx/.tsx files by default. This repo's legacy source/tests use
// JSX in plain .js files (a rename sweep to .jsx is out of scope for ticket
// 51 - see ticket 59). This plugin re-transforms matched .js files as JSX
// before Vite's core oxc transform gets a chance to reject them, mirroring
// the `moduleTypes: { ".js": "jsx" }` option used in rolldown.config.js for
// the production build.
export default function jsxInJsPlugin() {
    return {
        name: "jarl-jsx-in-js",
        enforce: "pre",
        async transform(code, id) {
            if (!id.endsWith(".js") || id.includes("/node_modules/")) {
                return null;
            }
            const result = await transformWithOxc(code, id, { lang: "jsx" });
            return { code: result.code, map: result.map };
        },
    };
}
