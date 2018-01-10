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
            path: "/?foo=bar",
            state: { foobar: true }
        },
        {
            path: "/?foo=bar&bar=foo",
            state: { foo: true, bar: true }
        }
    ]);
