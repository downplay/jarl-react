/* global test expect beforeEach */

import React from "react";
import { render } from "enzyme";
import Link from "../Link";

import MockProvider from "../../jarl-react/source/__tests__/mocks/MockProvider";
import { basicRoutes } from "../../jarl-react/source/__tests__/dummy/routes";

let homeLocation;

beforeEach(() => {
    homeLocation = { page: "home" };
});

test("Renders a TouchableHighlight", () => {
    const anchor = render(
        <MockProvider routes={basicRoutes()} location={homeLocation}>
            <Link to="/">Home</Link>
        </MockProvider>
    );
    expect(anchor[0].name).toEqual("view");
    expect(anchor.text()).toEqual("Home");
});

// TODO: Test clicks etc. and fix all the warnings from react-native-web
