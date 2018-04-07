/* global test expect */

import React from "react";
import { shallow } from "enzyme";

import { Router } from "../Router";

test("passes location and renders children", () => {
    const rendered = shallow(
        <Router location={{ foo: "bar" }}>
            {({ foo }) => <div>{foo}</div>}
        </Router>
    );
    expect(rendered.contains(<div>bar</div>)).toEqual(true);
});
