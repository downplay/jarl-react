/* global describe test expect beforeEach */

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

    test("it doesn't have a trailing slaahs", () => {
        expect(joinPaths("/foo", "/")).toEqual("/foo");
    });
});

describe("RouteMapper", () => {
    test("it constructs", () => {
        expect(new RouteMapper()).toEqual(expect.any(RouteMapper));
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
        let routes;
        beforeEach(() => {
            routes = queryStringRoutes();
        });

        describe("match", () => {
            test("throw when too many question marks", () => {
                expect(
                    () => new RouteMapper([{ path: "/foo?bar?baz" }])
                ).toThrow();
            });

            test("don't match plain path", () => {
                const match = routes.match("/plain");
                expect(match.state).toEqual({
                    status: 404,
                    missingPath: "plain"
                });
            });

            test("match query key", () => {
                const match = routes.match("/?foo=");
                expect(match.state).toEqual({ foo: true });
            });

            test("equals is optional for empty string", () => {
                const match = routes.match("/?foo");
                expect(match.state).toEqual({ foo: true });
            });

            test("match overloaded route", () => {
                const match = routes.match("/overload?foo");
                expect(match.state).toEqual({ overload: true, foo: true });
            });

            test("match query key value", () => {
                const match = routes.match("/?foo=bar");
                expect(match.state).toEqual({ foobar: true });
            });

            test("match two queries", () => {
                const match = routes.match("/?foo=bar&bar=foo");
                expect(match.state).toEqual({ foo: true, bar: true });
            });

            test("reverse query order", () => {
                const match = routes.match("/?bar=foo&foo=bar");
                expect(match.state).toEqual({ foo: true, bar: true });
            });

            test("merge nested queries", () => {
                const match = routes.match("/?nested&tested");
                expect(match.state).toEqual({ nested: true, tested: true });
            });

            test("match named query token", () => {
                const match = routes.match("/?q=something");
                expect(match.state).toEqual({
                    search: true,
                    searchTerm: "something"
                });
            });

            test("match optional query token", () => {
                const match = routes.match("/?optional=banana");
                expect(match.state).toEqual({
                    home: true,
                    optional: "banana"
                });
            });

            test("match without optional query", () => {
                const match = routes.match("/");
                expect(match.state).toEqual({
                    home: true
                });
            });

            test("match wildcard querystring", () => {
                const match = routes.match("/wildcard?charlie=kelly");
                expect(match.state).toEqual({
                    status: 404,
                    missingPath: "wildcard",
                    rest: { charlie: "kelly" }
                });
            });

            describe("nesting wildcards", () => {
                beforeEach(() => {
                    routes = new RouteMapper([
                        {
                            path: "/",
                            state: { page: "index" }
                        },
                        {
                            path: "/:demoName?*=:all",
                            state: { page: "demo" },
                            routes: [
                                {
                                    path: "/*:rest?*=:all",
                                    state: { subPage: true }
                                }
                            ]
                        },
                        {
                            path: "/*:missingPath?*=:query",
                            state: { page: "notFound" }
                        }
                    ]);
                });

                test("nested wildcard query string", () => {
                    // This specific case is taken from demo shell
                    const result = routes.match("/queryStrings/search?q=test");
                    expect(result.state).toEqual({
                        page: "demo",
                        demoName: "queryStrings",
                        rest: "search",
                        all: { q: "test" },
                        subPage: true
                    });
                });
            });

            describe("query string fragment", () => {
                beforeEach(() => {
                    // Also taken from the demos, in queryStrings
                    routes = new RouteMapper([
                        {
                            // This optional query match will be applied to all routes via nesting
                            path: "?theme=(:themeName)",
                            state: {},
                            routes: [
                                {
                                    path: "/",
                                    state: { page: "home" }
                                },
                                {
                                    // This fallback is needed to match the /search url without ?q
                                    path: "/search",
                                    state: { page: "search" }
                                },
                                {
                                    // Because this parameter is non-optional so we only hit this route when there is a search
                                    path: "/search?q=:searchTerm",
                                    state: { page: "search" }
                                },
                                {
                                    // 404 wildcard route
                                    path: "/*:missingPath"
                                }
                            ]
                        }
                    ]);
                });

                test("nested match without optional", () => {
                    // This specific case is taken from queryString demos
                    const result = routes.match("/");
                    expect(result.state).toEqual({
                        page: "home"
                    });
                });

                test("match base query string fragment", () => {
                    // This specific case is taken from queryString demos
                    const result = routes.match("/?theme=bar");
                    expect(result.state).toEqual({
                        page: "home",
                        themeName: "bar"
                    });
                });

                test("stringify correctly", () => {
                    const path = routes.stringify({
                        page: "home",
                        themeName: "bar"
                    });
                    expect(path).toEqual("/?theme=bar");
                });
            });
        });

        describe("stringify", () => {
            test("stringify simple query", () => {
                const path = routes.stringify({ foo: true });
                // Note: Would be nice if qs omitted '=' sign for neatness but this is fine
                expect(path).toEqual("/?foo=");
            });

            test("stringify another query", () => {
                const path = routes.stringify({ foo: true, bar: true });
                expect(path).toEqual("/?foo=bar&bar=foo");
            });

            test("stringify a named query token", () => {
                const path = routes.stringify({
                    search: true,
                    searchTerm: "something"
                });
                expect(path).toEqual("/?q=something");
            });

            test("stringify optional query token", () => {
                const path = routes.stringify({
                    home: true,
                    optional: "banana"
                });
                expect(path).toEqual("/?optional=banana");
            });

            test("stringify without optional", () => {
                const path = routes.stringify({
                    home: true
                });
                expect(path).toEqual("/");
            });

            test("stringify mixed pattern", () => {
                const path = routes.stringify({
                    mixed: true,
                    category: "fruit",
                    field: "color"
                });
                expect(path).toEqual("/mixed/fruit?sort=color");
            });

            test("stringify wildcard query string", () => {
                const path = routes.stringify({
                    status: 404,
                    missingPath: "wildcard",
                    rest: { charlie: "kelly" }
                });
                expect(path).toEqual("/wildcard?charlie=kelly");
            });
        });
    });

    describe("resolvers", () => {
        let routes;
        beforeEach(() => {
            routes = new RouteMapper([
                {
                    path: "/",
                    state: {},
                    resolve: () => ({ resolved: true })
                },
                {
                    path: "/dates/:date",
                    state: {},
                    resolve: ({ date }) => {
                        const parsed = new Date(date);
                        if (parsed.toString() === "Invalid Date") {
                            return false;
                        }
                        return {
                            date: parsed
                        };
                    }
                },
                {
                    path: "/dates/*:bad",
                    state: { badDate: true }
                }
            ]);
        });

        test("run resolve function", () => {
            const { state } = routes.match("/");
            expect(state.resolved).toEqual(true);
        });

        test("resolve one value into another", () => {
            const { state } = routes.match("/dates/2018-05-03");
            expect(state.date).toEqual(new Date("2018-05-03"));
        });

        test("fall through on fail resolve", () => {
            const { state } = routes.match("/dates/foobarbaz");
            expect(state.badDate).toEqual(true);
        });
    });
});
