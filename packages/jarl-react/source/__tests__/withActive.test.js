/* global describe test expect beforeEach */

import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import withActive from "../withActive";

import MockProvider from "./mocks/MockProvider";

configure({ adapter: new Adapter() });

describe("withActive", () => {
    let mockComponent;
    let routes;
    beforeEach(() => {
        routes = [
            {
                // Home route
                path: "/",
                state: {
                    page: "home"
                },
                routes: [
                    {
                        path: "/child",
                        state: {
                            page: "child"
                        }
                    }
                ]
            },
            {
                // About route (sibling)
                path: "/about",
                state: {
                    page: "about"
                }
            },
            {
                path: "/product/:id",
                state: {
                    page: "product"
                },
                routes: [
                    {
                        path: "/details",
                        state: {
                            page: "details"
                        }
                    }
                ]
            }
        ];
        mockComponent = () => <div />;
    });

    test("is active for home page", () => {
        const TestComponent = withActive()(mockComponent);
        const state = { page: "home" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider state={state} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(true);
    });

    test("is not active for sibling of home", () => {
        const TestComponent = withActive()(mockComponent);
        const state = { page: "about" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider state={state} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(false);
    });

    test("is active for child of home", () => {
        const TestComponent = withActive()(mockComponent);
        const state = { page: "child" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider state={state} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(true);
    });

    test("is not active for exact child of home", () => {
        const TestComponent = withActive({ exact: true })(mockComponent);
        const state = { page: "child" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider state={state} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(false);
    });

    test("is not active for different state same route", () => {
        const TestComponent = withActive()(mockComponent);
        const state = { page: "product", id: "1" };
        const to = { page: "product", id: "2" };
        const output = mount(
            <MockProvider state={state} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(false);
    });

    test("is active for same state same branch", () => {
        const TestComponent = withActive()(mockComponent);
        const state = { page: "details", id: "1" };
        const to = { page: "product", id: "1" };
        const output = mount(
            <MockProvider state={state} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(true);
    });
});
