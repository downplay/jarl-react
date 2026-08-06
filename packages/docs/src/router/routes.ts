/**
 * The docs site's own route table, built entirely from the vendored v2-style atoms
 * (see routeAtom.ts). This is the "dogfooding" part of ticket 58: the site's top-level
 * navigation, not just the /demos section, is powered by the new routing atoms rather
 * than a conventional router.
 */
import { atom } from "jotai";
import { rootAtom, staticRouteAtom, paramRouteAtom } from "./routeAtom";

export const homeRoute = rootAtom;

export const docsSectionRoute = staticRouteAtom("docs");
export const docPageRoute = paramRouteAtom("docName", { parent: docsSectionRoute });

export const apiSectionRoute = staticRouteAtom("api");
export const apiPageRoute = paramRouteAtom("apiName", { parent: apiSectionRoute });

export const changelogRoute = staticRouteAtom("changelog");

export const historyRoute = staticRouteAtom("history");

export const demosIndexRoute = staticRouteAtom("demos");

// Live "basic routing" demo, itself a nested tree of routes built on the same atoms -
// mirrors the shape of the old demo/source/demos/basicRouting example.
export const basicRoutingDemoRoute = staticRouteAtom("basic-routing", { parent: demosIndexRoute });
export const basicRoutingDemoPageRoute = paramRouteAtom("page", { parent: basicRoutingDemoRoute });

export type DocName = "getting-started" | "data-loading" | "path-variables" | "react-native" | "redux-integration";

export const docPages: { docName: DocName; title: string }[] = [
    { docName: "getting-started", title: "Getting Started" },
    { docName: "data-loading", title: "Data Loading" },
    { docName: "path-variables", title: "Path Variables" },
    { docName: "react-native", title: "React Native" },
    { docName: "redux-integration", title: "Redux Integration" }
];

export type ApiName = "jarl-react" | "jarl-react-native";

export const apiPages: { apiName: ApiName; title: string }[] = [
    { apiName: "jarl-react", title: "JARL" },
    { apiName: "jarl-react-native", title: "JARL Native" }
];

/** True when the current location matches none of the site's known pages. */
export const notFoundAtom = atom(get => {
    const matched = [
        get(homeRoute).exact,
        get(docsSectionRoute).exact,
        get(docPageRoute).exact,
        get(apiSectionRoute).exact,
        get(apiPageRoute).exact,
        get(changelogRoute).exact,
        get(historyRoute).exact,
        get(demosIndexRoute).exact,
        get(basicRoutingDemoRoute).exact,
        get(basicRoutingDemoPageRoute).exact
    ];
    return !matched.some(Boolean);
});

/** Every concrete path the SSG build should prerender to a static HTML file. */
export const staticPaths: string[] = [
    "/",
    "/docs",
    ...docPages.map(p => `/docs/${p.docName}`),
    "/api",
    ...apiPages.map(p => `/api/${p.apiName}`),
    "/changelog",
    "/history",
    "/demos",
    "/demos/basic-routing",
    "/demos/basic-routing/about"
];
