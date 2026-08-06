import { atom } from "jotai";

/**
 * A minimal, SSR-safe replacement for jotai-location's `atomWithLocation`.
 *
 * The v2 draft (jarl-react-v2, commit 44f8439) wires `routeAtom` directly to
 * `jotai-location`'s `atomWithLocation()`, which reads `window.location` at module
 * scope - fine in a browser-only SPA, but it throws immediately under Node during
 * SSR/SSG (there is no `window`). The docs site needs to render each route on the
 * server, so this reimplements just the slice of the interface `routeAtom` actually
 * needs: a readable `{ pathname, search }` location, and a write that pushes browser
 * history when running in a browser and is a harmless plain state update on the server.
 */

export type Location = {
    pathname: string;
    search: string;
};

const isBrowser = typeof window !== "undefined";

const initialLocation = (): Location =>
    isBrowser
        ? { pathname: window.location.pathname, search: window.location.search }
        : { pathname: "/", search: "" };

const rawLocationAtom = atom<Location>(initialLocation());

if (isBrowser) {
    rawLocationAtom.onMount = setAtom => {
        const handlePopState = () => {
            setAtom({ pathname: window.location.pathname, search: window.location.search });
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    };
}

/**
 * Readable/writable location atom. Reading gives the current `{ pathname, search }`.
 * Writing updates the atom and, in a browser, calls `history.pushState` so the address
 * bar and back/forward buttons stay in sync. On the server, writing just updates state -
 * used by the prerender script to seed each route before rendering.
 */
export const locationAtom = atom(
    get => get(rawLocationAtom),
    (_get, set, next: Location) => {
        set(rawLocationAtom, next);
        if (isBrowser) {
            const url = next.pathname + (next.search || "");
            if (url !== window.location.pathname + window.location.search) {
                window.history.pushState({}, "", url);
            }
        }
    }
);
