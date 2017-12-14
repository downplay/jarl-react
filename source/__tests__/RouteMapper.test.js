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

    test("it resolves dynamic routes", () => {
        const path = dynamicRoutes().resolve({ foo: "bar", id: "baz" });
        expect(path).toEqual("/foo/baz");
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
});
