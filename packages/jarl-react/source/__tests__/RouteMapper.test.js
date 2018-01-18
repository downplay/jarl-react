/* global describe test expect */

import RouteMapper, { joinPaths } from "../RouteMapper";
import {
    basicRoutes,
    childRoutes,
    dynamicRootRoutes,
    dynamicRoutes,
    wildcardIndexedRoutes,
    wildcardRoutes,
    queryStringRoutes
} from "./dummy/routes";

const nullMatch = {
    branch: [],
    state: null
};

describe("joinPaths", () => {
    test("it joins two route paths", () => {
        expect(joinPaths("/", "/")).toEqual("/");
    });
});

describe("RouteMapper", () => {
    test("it constructs", () => {
        expect(new RouteMapper()).toBeInstanceOf(RouteMapper);
    });

    test("it matches routes", () => {
        const routes = basicRoutes();
        {
            const match = routes.match("/");
            expect(match.state).toEqual({ page: "home" });
            expect(match.branch).toEqual([
                {
                    route: {
                        path: "/",
                        state: { page: "home" }
                    },
                    match: {}
                }
            ]);
        }
        {
            const match = routes.match("/about");
            expect(match.state).toEqual({ page: "about" });
            expect(match.branch).toEqual([
                {
                    route: {
                        path: "/about",
                        state: { page: "about" }
                    },
                    match: {}
                }
            ]);
        }
    });

    test("it stringifies routes", () => {
        const path = basicRoutes().stringify({ page: "home" });
        expect(path).toEqual("/");
        const path2 = basicRoutes().stringify({ page: "about" });
        expect(path2).toEqual("/about");
    });

    test("it doesn't stringify partial state", () => {
        const routes = new RouteMapper([
            {
                path: "/",
                state: { foo: true, bar: true }
            }
        ]);
        const path = routes.stringify({ foo: true });
        expect(path).toEqual(null);
    });

    test("it stringifies dynamic routes", () => {
        const path = dynamicRoutes().stringify({ foo: "bar", id: "baz" });
        expect(path).toEqual("/foo/baz");
    });

    test("it stringifies dynamic route alone", () => {
        const routes = dynamicRootRoutes();
        const path = routes.stringify({ id: "bar" });
        expect(path).toEqual("/bar");
    });

    test("it matches parent route", () => {
        const routes = childRoutes();
        const match = routes.match("/foo");
        expect(match.state).toEqual({ foo: true });
    });

    test("it matches child route", () => {
        const routes = childRoutes();
        const match = routes.match("/foo/bar");
        expect(match.state).toEqual({ foo: true, bar: true });
    });

    test("it stringifies parent route", () => {
        const routes = childRoutes();
        const path = routes.stringify({ foo: true });
        expect(path).toEqual("/foo");
    });

    test("it stringifies child route", () => {
        const routes = childRoutes();
        const path = routes.stringify({ foo: true, bar: true });
        expect(path).toEqual("/foo/bar");
    });

    test("it doesn't stringify child route fragment", () => {
        const routes = childRoutes();
        const path = routes.stringify({ bar: true });
        expect(path).toEqual(null);
    });

    test("it decodes URI components", () => {
        const routes = dynamicRootRoutes();
        const match = routes.match("/Some%20Thing");
        expect(match.state).toEqual({ id: "Some Thing" });
    });

    test("match wildcard paths", () => {
        const routes = wildcardRoutes();
        const match = routes.match("/test");
        expect(match.state).toEqual({ path: "test" });
        const match2 = routes.match("/test/foo/1");
        expect(match2.state).toEqual({ path: "test/foo/1" });
    });

    test("match nested wildcard paths", () => {
        const routes = wildcardIndexedRoutes();
        const match = routes.match("/foo/bar");
        expect(match.state).toEqual({ first: "foo", second: "bar" });
        const match2 = routes.match("/test");
        expect(match2).toEqual(nullMatch);
    });

    describe("query strings", () => {
        describe("match", () => {
            test("throw when too many question marks", () => {
                expect(
                    () => new RouteMapper([{ path: "/foo?bar?baz" }])
                ).toThrow();
            });

            test("don't match plain path", () => {
                const routes = queryStringRoutes();
                const match = routes.match("/");
                expect(match).toEqual(nullMatch);
            });

            test("match query key", () => {
                const routes = queryStringRoutes();
                const match = routes.match("/?foo");
                expect(match.state).toEqual({ foo: true });
            });

            test("match query key value", () => {
                const routes = queryStringRoutes();
                const match = routes.match("/?foo=bar");
                expect(match.state).toEqual({ foobar: true });
            });

            test("match two queries", () => {
                const routes = queryStringRoutes();
                const match = routes.match("/?foo=bar&bar=foo");
                expect(match.state).toEqual({ foo: true, bar: true });
            });

            test("reverse query order", () => {
                const routes = queryStringRoutes();
                const match = routes.match("/?bar=foo&foo=bar");
                expect(match.state).toEqual({ foo: true, bar: true });
            });

            test("merge nested queries", () => {
                const routes = queryStringRoutes();
                const match = routes.match("/?nested&tested");
                expect(match.state).toEqual({ nested: true, tested: true });
            });
        });

        describe("stringify", () => {
            test("stringify simple query", () => {
                const routes = queryStringRoutes();
                const path = routes.stringify({ foo: true });
                expect(path).toEqual("/?foo");
            });

            test("stringify another query", () => {
                const routes = queryStringRoutes();
                const path = routes.stringify({ foo: true, bar: true });
                expect(path).toEqual("/?foo");
            });
        });
    });
});
