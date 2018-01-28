/* global describe test expect beforeEach */

import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import withState from "../withState";

import MockProvider from "./mocks/MockProvider";

configure({ adapter: new Adapter() });

describe("withState", () => {
    let mockComponent;
    beforeEach(() => {
        mockComponent = () => <div />;
    });

    test("passes arbitrary state to component", () => {
        const TestComponent = withState()(mockComponent);
        const mockState = { foo: Symbol("bar") };
        const output = mount(
            <MockProvider state={mockState}>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.foo).toEqual(mockState.foo);
    });

    test("passes state to other props", () => {
        const TestComponent = withState(({ foo }) => ({ baz: foo }))(
            mockComponent
        );
        const mockState = { foo: Symbol("bar") };
        const output = mount(
            <MockProvider state={mockState}>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.foo).toEqual(undefined);
        expect(props.baz).toEqual(mockState.foo);
    });
});
