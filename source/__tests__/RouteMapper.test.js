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
});
