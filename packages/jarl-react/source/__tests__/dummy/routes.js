import RouteMapper from "../../RouteMapper";

export const basicRoutes = () =>
    new RouteMapper([
        {
            path: "/",
            state: { page: "home" }
        },
        {
            path: "/about",
            state: { page: "about" }
        }
    ]);

export const dynamicRoutes = () =>
    new RouteMapper([
        {
            path: "/foo/:id",
            state: { foo: "bar" }
        }
    ]);

export const childRoutes = () =>
    new RouteMapper([
        {
            path: "/",
            state: { nested: true },
            routes: [
                {
                    path: "/",
                    state: { tested: true }
                }
            ]
        },
        {
            path: "/foo",
            state: { foo: true },
            routes: [
                {
                    path: "/bar",
                    state: { bar: true }
                }
            ]
        }
    ]);

export const dynamicRootRoutes = () =>
    new RouteMapper([
        {
            path: "/:id"
        }
    ]);

export const wildcardRoutes = () =>
    new RouteMapper([
        {
            path: "/*:path"
        }
    ]);

export const wildcardIndexedRoutes = () =>
    new RouteMapper([
        {
            path: "/*:first/*:second"
        }
    ]);

export const queryStringRoutes = () =>
    new RouteMapper([
        {
            path: "/?foo",
            state: { foo: true }
        },
        {
            path: "/plain?foo",
            state: { plain: true }
        },
        {
            path: "/?foo=bar",
            state: { foobar: true }
        },
        {
            path: "/?foo=bar&bar=foo",
            state: { foo: true, bar: true }
        },
        {
            path: "/?nested",
            state: { nested: true },
            routes: [
                {
                    path: "/?tested",
                    state: { tested: true }
                }
            ]
        },
        {
            path: "/?q=:term",
            state: { search: true }
        },
        {
            path: "/?optional=(:optional)",
            state: { home: true }
        }
    ]);
