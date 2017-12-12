import React, { Component } from "react";
import { configure, render } from "enzyme";

import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import Link from "../Link";
import MockProvider from "./mocks/MockProvider";

// TODO: Test click handling

describe("<Link/>", () => {
    test("it renders with a string URL", () => {
        const anchor = render(
            <MockProvider>
                <Link to="/">Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });
});
