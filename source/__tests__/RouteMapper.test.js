import React, { Component } from "react";
import { shallow, mount } from "enzyme";
import RouteMapper from "../RouteMapper";

class MockEntity extends Component {
    render() {
        return null;
    }
}

test("it constructs", () => {
    expect(new RouteMapper()).toBeInstanceOf(RouteMapper);
});
