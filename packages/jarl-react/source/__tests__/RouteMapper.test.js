import React, { Component } from "react";
import { shallow, mount } from "enzyme";
import RouteMapper from "../RouteMapper";
import {
    basicRoutes,
    childRoutes,
    dynamicRootRoutes,
    dynamicRoutes,
    wildcardIndexedRoutes,
    wildcardRoutes
} from "./dummy/routes";

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
        expect(match2.state).toEqual(null);
    });
});
