/* global test expect */

import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Router } from "../Router";

configure({ adapter: new Adapter() });

test("passes location and renders children", () => {
    const rendered = shallow(
        <Router location={{ foo: "bar" }}>
            {({ foo }) => <div>{foo}</div>}
        </Router>
    );
    expect(rendered.contains(<div>bar</div>)).toEqual(true);
});
