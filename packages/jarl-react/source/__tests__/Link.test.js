import React, { Component } from "react";
import { configure, render } from "enzyme";

import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import Link from "../Link";
import MockProvider from "./mocks/MockProvider";

import { basicRoutes } from "./dummy/routes";

// TODO: Test click handling

describe("<Link/>", () => {
    test("renders an anchor from a URL", () => {
        const anchor = render(
            <MockProvider>
                <Link to="/">Home</Link>
            </MockProvider>
        );
        expect(anchor.find("a").length).toEqual(1);
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("renders an anchor from a state object", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()}>
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.find("a").length).toEqual(1);
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });
});
