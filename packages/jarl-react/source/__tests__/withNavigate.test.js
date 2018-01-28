/* global describe test expect beforeEach */

import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import withNavigate from "../withNavigate";

import MockProvider from "./mocks/MockProvider";
import mockHistory from "./mocks/mockHistory";

configure({ adapter: new Adapter() });

describe("withNavigate", () => {
    let mockComponent;
    let history;
    beforeEach(() => {
        mockComponent = () => <div />;
        history = mockHistory();
    });

    test("passes `navigate` prop to component", () => {
        const TestComponent = withNavigate()(mockComponent);
        const output = mount(
            <MockProvider>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.navigate).toEqual(expect.any(Function));
    });

    test("calling `navigate` triggers history push", () => {
        const TestComponent = withNavigate()(mockComponent);
        const output = mount(
            <MockProvider history={history}>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        props.navigate("/fleeb");
        expect(history.push).toHaveBeenCalledWith("/fleeb");
    });
});
