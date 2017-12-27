import React, { Component } from "react";
import { configure, render } from "enzyme";

import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import Link from "../Link";
import MockProvider from "./mocks/MockProvider";

import { basicRoutes } from "./dummy/routes";

// TODO: Test click handling

describe("<Link/>", () => {
    test("renders a URL from a string", () => {
        const link = render(
            <MockProvider>
                <Link to="/">Home</Link>
            </MockProvider>
        );
        expect(link.prop("href")).toEqual("/");
        expect(link.text()).toEqual("Home");
    });

    test("renders a URL from a state object", () => {
        const link = render(
            <MockProvider routes={basicRoutes()}>
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(link.prop("href")).toEqual("/");
        expect(link.text()).toEqual("Home");
    });
});
