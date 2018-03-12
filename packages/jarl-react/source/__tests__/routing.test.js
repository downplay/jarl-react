/* global describe test expect beforeEach */

import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import routing from "../routing";

import MockProvider from "./mocks/MockProvider";
import mockHistory from "./mocks/mockHistory";

configure({ adapter: new Adapter() });

describe("location", () => {
    let mockComponent;
    beforeEach(() => {
        mockComponent = () => <div />;
    });

    test("passes arbitrary location props to component", () => {
        const TestComponent = routing()(mockComponent);
        const mockState = { foo: Symbol("bar") };
        const output = mount(
            <MockProvider location={mockState}>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.foo).toEqual(mockState.foo);
    });

    test("maps specific props", () => {
        const TestComponent = routing(({ foo }) => ({ baz: foo }))(
            mockComponent
        );
        const mockState = { foo: Symbol("bar") };
        const output = mount(
            <MockProvider location={mockState}>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.foo).toEqual(undefined);
        expect(props.baz).toEqual(mockState.foo);
    });
});

describe("isActive", () => {
    let mockComponent;
    let routes;
    let TestComponent;
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
        TestComponent = routing(null, ({ isActive }, { to }) => ({
            active: isActive(to)
        }))(mockComponent);
    });

    test("is active for home page", () => {
        const location = { page: "home" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider location={location} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(true);
    });

    test("is not active for sibling of home", () => {
        const location = { page: "about" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider location={location} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(false);
    });

    test("is active for child of home", () => {
        const location = { page: "child" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider location={location} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(true);
    });

    test("is not active for exact child of home", () => {
        TestComponent = routing(null, ({ isActive }, { to }) => ({
            active: isActive(to, true)
        }))(mockComponent);
        const location = { page: "child" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider location={location} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(false);
    });

    test("is not active for different location same route", () => {
        const location = { page: "product", id: "1" };
        const to = { page: "product", id: "2" };
        const output = mount(
            <MockProvider location={location} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(false);
    });

    test("is active for same location same branch", () => {
        const location = { page: "details", id: "1" };
        const to = { page: "product", id: "1" };
        const output = mount(
            <MockProvider location={location} routes={routes}>
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(true);
    });

    test("is not active when route is outside base path", () => {
        const history = mockHistory("/bar");
        const location = { page: "home" };
        const to = { page: "home" };
        const output = mount(
            <MockProvider
                location={location}
                routes={routes}
                history={history}
                basePath="/foo"
            >
                <TestComponent to={to} />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.active).toEqual(false);
    });
});

describe("navigate", () => {
    let mockComponent;
    let history;
    let TestComponent;
    beforeEach(() => {
        mockComponent = () => <div />;
        history = mockHistory();
        TestComponent = routing(() => ({}), ({ navigate }) => ({ navigate }))(
            mockComponent
        );
    });

    test("passes `navigate` prop to component", () => {
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

describe("redirect", () => {
    let mockComponent;
    let history;
    let TestComponent;
    beforeEach(() => {
        mockComponent = () => <div />;
        history = mockHistory();
        TestComponent = routing(() => ({}), ({ redirect }) => ({ redirect }))(
            mockComponent
        );
    });

    test("passes `redirect` prop to component", () => {
        const output = mount(
            <MockProvider>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        expect(props.redirect).toEqual(expect.any(Function));
    });

    test("calling `redirect` triggers history replace", () => {
        const output = mount(
            <MockProvider history={history}>
                <TestComponent />
            </MockProvider>
        );
        const test = output.find(mockComponent);
        const props = test.props();
        props.redirect("/fleeb");
        expect(history.replace).toHaveBeenCalledWith("/fleeb");
    });
});

// TODO: Tests for stringify
