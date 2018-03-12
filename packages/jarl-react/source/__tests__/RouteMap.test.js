/* global describe test expect beforeEach */
import { format } from "date-fns";
import RouteMap, { joinPaths } from "../RouteMap";
import redirect from "../redirect";

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
    location: null
};

describe("joinPaths", () => {
    test("it joins two route paths", () => {
        expect(joinPaths("/", "/")).toEqual("/");
    });

    test("it doesn't have a trailing slaahs", () => {
        expect(joinPaths("/foo", "/")).toEqual("/foo");
    });
});

describe("RouteMap", () => {
    test("it constructs", () => {
        expect(new RouteMap()).toEqual(expect.any(RouteMap));
    });

    test("it matches routes", () => {
        const routes = basicRoutes();
        {
            const match = routes.match("/");
            expect(match.location).toEqual({ page: "home" });
            expect(match.branch).toEqual([
                {
                    path: "/",
                    state: { page: "home" }
                }
            ]);
        }
        {
            const match = routes.match("/about");
            expect(match.location).toEqual({ page: "about" });
            expect(match.branch).toEqual([
                {
                    path: "/about",
                    state: { page: "about" }
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

    test("it doesn't stringify partial location", () => {
        const routes = new RouteMap([
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
        expect(match.location).toEqual({ foo: true });
    });

    test("it matches child route", () => {
        const routes = childRoutes();
        const match = routes.match("/foo/bar");
        expect(match.location).toEqual({ foo: true, bar: true });
        expect(match.branch).toEqual([
            {
                path: "/foo",
                routes: [{ path: "/bar", state: { bar: true } }],
                state: { foo: true }
            },
            { path: "/bar", state: { bar: true } }
        ]);
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
        expect(match.location).toEqual({ id: "Some Thing" });
    });

    test("it decodes more URI components", () => {
        const routes = dynamicRootRoutes();
        const match = routes.match(
            "/Content%20was%20not%20found%3A%20%27not-a-real-page%27"
        );
        expect(match.location).toEqual({
            id: "Content was not found: 'not-a-real-page'"
        });
    });

    test("match wildcard paths", () => {
        const routes = wildcardRoutes();
        const match = routes.match("/test");
        expect(match.location).toEqual({ path: "test" });
        const match2 = routes.match("/test/foo/1");
        expect(match2.location).toEqual({ path: "test/foo/1" });
    });

    test("match nested wildcard paths", () => {
        const routes = wildcardIndexedRoutes();
        const match = routes.match("/foo/bar");
        expect(match.location).toEqual({ first: "foo", second: "bar" });
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
                    () => new RouteMap([{ path: "/foo?bar?baz" }])
                ).toThrow();
            });

            test("don't match plain path", () => {
                const match = routes.match("/plain");
                expect(match.location).toEqual({
                    status: 404,
                    missingPath: "plain"
                });
            });

            test("match query key", () => {
                const match = routes.match("/?foo=");
                expect(match.location).toEqual({ foo: true });
            });

            test("equals is optional for empty string", () => {
                const match = routes.match("/?foo");
                expect(match.location).toEqual({ foo: true });
            });

            test("match overloaded route", () => {
                const match = routes.match("/overload?foo");
                expect(match.location).toEqual({ overload: true, foo: true });
            });

            test("match query key value", () => {
                const match = routes.match("/?foo=bar");
                expect(match.location).toEqual({ foobar: true });
            });

            test("match two queries", () => {
                const match = routes.match("/?foo=bar&bar=foo");
                expect(match.location).toEqual({ foo: true, bar: true });
            });

            test("reverse query order", () => {
                const match = routes.match("/?bar=foo&foo=bar");
                expect(match.location).toEqual({ foo: true, bar: true });
            });

            test("merge nested queries", () => {
                const match = routes.match("/?nested&tested");
                expect(match.location).toEqual({ nested: true, tested: true });
            });

            test("match named query token", () => {
                const match = routes.match("/?q=something");
                expect(match.location).toEqual({
                    search: true,
                    searchTerm: "something"
                });
            });

            test("decodes URI components", () => {
                const match = routes.match("/?q=something%20else");
                expect(match.location).toEqual({
                    search: true,
                    searchTerm: "something else"
                });
            });

            test("decodes more URI components", () => {
                // Example taken from redirects demo, was failing on apostrophes
                const match = routes.match(
                    "/?q=Content%20was%20not%20found%3A%20%27not-a-real-page%27"
                );
                expect(match.location).toEqual({
                    search: true,
                    searchTerm: "Content was not found: 'not-a-real-page'"
                });
            });

            test("match optional query token", () => {
                const match = routes.match("/?optional=banana");
                expect(match.location).toEqual({
                    home: true,
                    optional: "banana"
                });
            });

            test("match without optional query", () => {
                const match = routes.match("/");
                expect(match.location).toEqual({
                    home: true
                });
            });

            test("match wildcard querystring", () => {
                const match = routes.match("/wildcard?charlie=kelly");
                expect(match.location).toEqual({
                    status: 404,
                    missingPath: "wildcard",
                    rest: { charlie: "kelly" }
                });
            });

            describe("nesting wildcards", () => {
                beforeEach(() => {
                    routes = new RouteMap([
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
                    expect(result.location).toEqual({
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
                    routes = new RouteMap([
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
                                    // Because this parameter is non-optional so we only hit
                                    // this route when there is a search
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
                    expect(result.location).toEqual({
                        page: "home"
                    });
                });

                test("match base query string fragment", () => {
                    // This specific case is taken from queryString demos
                    const result = routes.match("/?theme=bar");
                    expect(result.location).toEqual({
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

            test("edge case, matched path with missing optional wildcard query", () => {
                routes = new RouteMap([
                    {
                        path: "/:demoName?*=:all",
                        state: { page: "demo" }
                    }
                ]);
                // This was causing an error in demos as :all was not present in the location
                const path = routes.stringify({
                    page: "demo",
                    demoName: "hello"
                });
                expect(path).toEqual("/hello");
            });
        });

        describe("misc", () => {
            test("periods in query can be matched", () => {
                const path = routes.stringify({
                    page: "login",
                    returnUrl: "http://example.com/foobar"
                });
                expect(path).toEqual(
                    "/login?returnUrl=http%3A%2F%2Fexample.com%2Ffoobar"
                );
                const { location } = routes.match(path);
                expect(location).toEqual({
                    page: "login",
                    returnUrl: "http://example.com/foobar"
                });
            });

            // TODO: See comment in relevant routes file. Really needs fixing.
            test.skip("wildcard in query can be optional", () => {
                const path = routes.stringify({
                    page: "login"
                });
                expect(path).toEqual("/login");
                const { location } = routes.match(path);
                expect(location).toEqual({
                    page: "login"
                });
            });
        });
    });

    describe("matchers", () => {
        let routes;
        beforeEach(() => {
            routes = new RouteMap([
                {
                    path: "/",
                    state: {},
                    match: () => ({ matched: true })
                },
                {
                    path: "/dates/:date",
                    state: {},
                    match: ({ date }) => {
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
                },
                {
                    path: "/products/:productId",
                    state: { page: "product" },
                    match: ({ productId, ...rest }) =>
                        productId === "123"
                            ? { product: { id: "123" }, ...rest }
                            : false
                },
                {
                    path: "/admin",
                    state: { page: "admin" },
                    match: (location, { role }) =>
                        role === "admin"
                            ? { ok: true, ...location }
                            : redirect("/"),
                    routes: [
                        {
                            path: "/ban?users=:usersList",
                            state: { action: "ban" },
                            match: ({ ok, usersList, ...rest }) =>
                                // Note: ok should always be true, just testing
                                // that priorly matched location is available here
                                ok
                                    ? {
                                          users: usersList.split(","),
                                          ...rest
                                      }
                                    : redirect("/login")
                        }
                    ]
                }
            ]);
        });

        test("run resolve function", () => {
            const { location } = routes.match("/");
            expect(location.matched).toEqual(true);
        });

        test("transform one value into another", () => {
            const { location } = routes.match("/dates/2018-05-03");
            expect(location.date).toEqual(new Date("2018-05-03"));
        });

        test("fall through on fail resolve", () => {
            const { location } = routes.match("/dates/foobarbaz");
            expect(location.badDate).toEqual(true);
        });

        test("matches product id", () => {
            const { location } = routes.match("/products/123");
            expect(location).toEqual({
                product: { id: "123" },
                page: "product"
            });
        });

        test("doesn't match bad product id", () => {
            const { location } = routes.match("/products/1234");
            expect(location).toEqual(null);
        });

        test("nested match prevents unauthorised", () => {
            const { location } = routes.match("/admin/ban?users=foo,bar,baz", {
                role: "guest"
            });
            expect(location).toEqual(redirect("/"));
        });

        test("nested match allows authorised and maps list", () => {
            const { location } = routes.match("/admin/ban?users=foo,bar,baz", {
                role: "admin"
            });
            expect(location).toEqual({
                page: "admin",
                action: "ban",
                users: ["foo", "bar", "baz"]
            });
        });
    });

    /**
     * These tests apply the previous match rules in reverse
     */
    describe("stringifiers", () => {
        let routes;
        beforeEach(() => {
            routes = new RouteMap([
                {
                    path: "/",
                    state: {},
                    stringify: ({ matched }) => matched && {}
                },
                {
                    path: "/dates/:date",
                    state: {},
                    stringify: ({ date }) =>
                        date instanceof Date
                            ? { date: format(date, "YYYY-MM-DD") }
                            : false
                },
                {
                    path: "/dates/*:bad",
                    state: { badDate: true },
                    stringify: ({ date }) =>
                        date && { badDate: true, bad: date }
                },
                {
                    path: "/products/:productId",
                    state: { page: "product" },
                    stringify: ({ product, ...rest }) =>
                        product ? { productId: product.id, ...rest } : false
                },
                {
                    path: "/admin",
                    state: { page: "admin" },
                    match: (location, { role }) =>
                        role === "admin"
                            ? { ok: true, ...location }
                            : redirect("/"),
                    // Normally we don't need to do this, stringify will just fail
                    // if required state is not there; this is specifically to
                    // test whether stringify is resolving in the correct order (bottom-up)
                    // *and* passing location up the function chain
                    stringify: location =>
                        location.usersList ? location : false,
                    routes: [
                        {
                            path: "/ban?users=:usersList",
                            state: { action: "ban" },
                            stringify: ({ users, ...rest }) => ({
                                usersList: users ? users.join(",") : undefined,
                                ...rest
                            })
                        }
                    ]
                }
            ]);
        });

        test("doesn't stringify no match", () => {
            const path = routes.stringify({ matched: false });
            expect(path).toEqual(null);
        });

        test("stringifies on match", () => {
            const path = routes.stringify({ matched: true });
            expect(path).toEqual("/");
        });

        test("formats date using stringifier", () => {
            const path = routes.stringify({ date: new Date("2018-05-03") });
            expect(path).toEqual("/dates/2018-05-03");
        });

        test("falls through to next stringifier", () => {
            const path = routes.stringify({ date: "foobarbaz" });
            expect(path).toEqual("/dates/foobarbaz");
        });

        test("doesn't stringify product id", () => {
            const path = routes.stringify({ productId: "123" });
            expect(path).toEqual(null);
        });

        test("stringifies on different location key", () => {
            const path = routes.stringify({
                page: "product",
                product: { id: "123" }
            });
            expect(path).toEqual("/products/123");
        });

        test("nested stringify (reverses order)", () => {
            // Note: no context required. Stringify shouldn't create different
            // URL just because different user is logged in.
            const path = routes.stringify({
                page: "admin",
                action: "ban",
                users: ["foo", "bar", "baz"]
            });
            expect(path).toEqual("/admin/ban?users=foo%2Cbar%2Cbaz");
        });
    });
});
