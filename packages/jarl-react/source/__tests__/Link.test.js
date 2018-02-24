/* global describe test expect */

import React from "react";
import { configure, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Link from "../Link";
import MockProvider from "./mocks/MockProvider";

import { basicRoutes } from "./dummy/routes";

configure({ adapter: new Adapter() });

describe("<Link/>", () => {
    test("renders an anchor from a URL", () => {
        const anchor = render(
            <MockProvider>
                <Link to="/">Home</Link>
            </MockProvider>
        );
        expect(anchor[0].name).toEqual("a");
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("renders a different component", () => {
        const anchor = render(
            <MockProvider>
                <Link to="/" component="div">
                    Home
                </Link>
            </MockProvider>
        );
        expect(anchor[0].name).toEqual("div");
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("renders an anchor from a state object", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()}>
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("basePath is prepended to URL", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()} basePath="/foo">
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/foo");
    });

    test("paths are concatenated correctly", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()} basePath="/foo">
                <Link to={{ page: "about" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/foo/about");
    });
});
