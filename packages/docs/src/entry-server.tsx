import { renderToString } from "react-dom/server";
import { createStore, Provider } from "jotai";
import App from "./App";
import { locationAtom } from "./router/location";

// Re-exported so the plain-Node prerender script (scripts/build.mjs) can drive the
// build off a single source of truth for "which paths exist", without needing to
// itself understand TypeScript module resolution.
export { staticPaths } from "./router/routes";

export type RenderResult = {
    html: string;
};

/** Renders the app for a given path, on the server. Each call gets its own jotai store, so prerendering many routes in one process can't leak state between them. */
export const render = (path: string): RenderResult => {
    const store = createStore();
    const [pathname, search = ""] = [path.split("?")[0], path.includes("?") ? `?${path.split("?")[1]}` : ""];
    store.set(locationAtom, { pathname: pathname || "/", search });
    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    );
    return { html };
};
