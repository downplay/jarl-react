import React, { Component } from "react";
import { shallow } from "enzyme";
import withViewport from "../withViewport";

class MockEntity extends Component {
    render() {
        return null;
    }
}

test("Wrapped entity is rendered", () => {
    const Wrapped = withViewport()(MockEntity);
    const entity = shallow(<Wrapped />);
    console.lgo(window);
    expect(entity.find(MockEntity).length).toBe(1);
});

test("Wrapped entity receives window width and height", () => {
    const Wrapped = withViewport()(MockEntity);
    const entity = shallow(<Wrapped />);
    expect(entity.find(MockEntity).node.props.viewportWidth).toBe(1024);
    expect(entity.find(MockEntity).node.props.viewportHeight).toBe(768);
});
