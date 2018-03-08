import RouteMap from "../../RouteMap";

export const basicRoutes = () =>
    new RouteMap([
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
    new RouteMap([
        {
            path: "/foo/:id",
            state: { foo: "bar" }
        }
    ]);

export const childRoutes = () =>
    new RouteMap([
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
    new RouteMap([
        {
            path: "/:id"
        }
    ]);

export const wildcardRoutes = () =>
    new RouteMap([
        {
            path: "/*:path"
        }
    ]);

export const wildcardIndexedRoutes = () =>
    new RouteMap([
        {
            path: "/*:first/*:second"
        }
    ]);

export const queryStringRoutes = () =>
    new RouteMap([
        {
            path: "/?foo",
            state: { foo: true }
        },
        {
            path: "/plain?foo",
            state: { plain: false }
        },
        {
            path: "/overload",
            state: { overload: true }
        },
        {
            path: "/overload?foo",
            state: { overload: true, foo: true }
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
            path: "/mixed/:category?sort=:field",
            state: { mixed: true }
        },
        // TODO: Making this query optional broke the URL (key didn't even get stringified).
        // Need to fix this because to work around the `.` issue in query parts
        // requires this. And it's definitely non-expected behavior. It's a bit broken that
        // the wildcard is needed at all, guessing it's related to url-pattern's domain matching,
        // might need a hacky workaround until I get around to writing a completely custom parser.
        // { path: "/login?returnUrl=(*:returnUrl)", state: { page: "login" } },
        { path: "/login?returnUrl=*:returnUrl", state: { page: "login" } },
        {
            path: "/?q=:searchTerm",
            state: { search: true }
        },
        {
            path: "/?optional=(:optional)",
            state: { home: true }
        },
        {
            path: "/*:missingPath?*=:rest",
            state: { status: 404 }
        }
    ]);
