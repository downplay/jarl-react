import React, { Component } from "react";
import { shallow, mount } from "enzyme";
import RouteMapper from "../RouteMapper";

const basicRoutes = () =>
    new RouteMapper([
        {
            path: "/",
            state: { page: "home" }
        },
        {
            path: "/about",
            state: { page: "about" }
        },
        {
            path: "/about/",
            state: { page: "about" }
        }
    ]);

const dynamicRoutes = () =>
    new RouteMapper([
        {
            path: "/foo/:id",
            state: { foo: "bar" }
        }
    ]);

const childRoutes = () =>
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

const dynamicRootRoutes = () =>
    new RouteMapper([
        {
            path: "/:id"
        }
    ]);

describe("RouteMapper", () => {
    test("it constructs", () => {
        expect(new RouteMapper()).toBeInstanceOf(RouteMapper);
    });

    test("it matches routes", () => {
        const match = basicRoutes().match("/");
        expect(match.state).toEqual({ page: "home" });
        const match2 = basicRoutes().match("/about");
        expect(match2.state).toEqual({ page: "about" });
    });

    test("it resolves routes", () => {
        const path = basicRoutes().resolve({ page: "home" });
        expect(path).toEqual("/");
        const path2 = basicRoutes().resolve({ page: "about" });
        expect(path2).toEqual("/about");
    });

    test("it doesn't resolve partial state", () => {
        const routes = new RouteMapper([
            {
                path: "/",
                state: { foo: true, bar: true }
            }
        ]);
        const path = routes.resolve({ foo: true });
        expect(path).toEqual(null);
    });

    test("it resolves dynamic routes", () => {
        const path = dynamicRoutes().resolve({ foo: "bar", id: "baz" });
        expect(path).toEqual("/foo/baz");
    });

    test("it resolve dynamic route alone", () => {
        const routes = dynamicRootRoutes();
        const path = routes.resolve({ id: "bar" });
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

    test("it resolves parent route", () => {
        const routes = childRoutes();
        const path = routes.resolve({ foo: true });
        expect(path).toEqual("/foo");
    });

    test("it resolves child route", () => {
        const routes = childRoutes();
        const path = routes.resolve({ foo: true, bar: true });
        expect(path).toEqual("/foo/bar");
    });

    test("it doesn't resolve child route fragment", () => {
        const routes = childRoutes();
        const path = routes.resolve({ bar: true });
        expect(path).toEqual(null);
    });
});
