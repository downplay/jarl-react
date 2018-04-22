/* global describe test jest expect beforeEach */

import React from "react";
import { render, mount } from "enzyme";

import Link from "../Link";
import MockProvider from "./mocks/MockProvider";
import mockHistory from "./mocks/mockHistory";

import { basicRoutes } from "./dummy/routes";

describe("<Link/>", () => {
    let homeLocation;

    beforeEach(() => {
        homeLocation = { page: "home" };
    });

    test("renders an anchor from a URL", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()} location={homeLocation}>
                <Link to="/">Home</Link>
            </MockProvider>
        );
        expect(anchor[0].name).toEqual("a");
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("renders a different element", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()} location={homeLocation}>
                <Link to={homeLocation} element="div">
                    Home
                </Link>
            </MockProvider>
        );
        expect(anchor[0].name).toEqual("div");
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("renders an anchor from a location object", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()} location={homeLocation}>
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("basePath is prepended to URL", () => {
        const anchor = render(
            <MockProvider
                routes={basicRoutes()}
                basePath="/foo"
                location={homeLocation}
            >
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/foo");
    });

    test("paths are concatenated correctly", () => {
        const anchor = render(
            <MockProvider
                routes={basicRoutes()}
                basePath="/foo"
                location={homeLocation}
            >
                <Link to={{ page: "about" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/foo/about");
    });

    test("click triggers navigate and prevents default", () => {
        const history = mockHistory();
        const app = mount(
            <MockProvider
                routes={basicRoutes()}
                location={homeLocation}
                history={history}
                basePath="/foo"
                performInitialRouting={false}
            >
                <Link to={{ page: "about" }}>Home</Link>
            </MockProvider>
        );
        const event = { preventDefault: jest.fn() };
        const link = app.find(Link);
        link.simulate("click", event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(history.push).toHaveBeenCalledWith("/foo/about");
    });

    describe("function-as-child rendering", () => {
        let event;
        let history;
        let location;
        beforeEach(() => {
            event = { preventDefault: jest.fn() };
            history = mockHistory("/about");
            location = { page: "about" };
        });

        // TODO: Provide `replace` and `push` instead of onClick?
        test("renders active link", () => {
            const wrapper = mount(
                <MockProvider
                    routes={basicRoutes()}
                    history={history}
                    location={location}
                >
                    <Link to="/about">
                        {({ href, active }) => (
                            <li className={active ? "active" : "not"}>
                                <a href={href}>About</a>
                            </li>
                        )}
                    </Link>
                </MockProvider>
            );
            const anchor = wrapper.find("li");
            expect(anchor.prop("className")).toEqual("active");
            expect(wrapper.find("a").prop("href")).toEqual("/about");
        });

        test("renders active link with basePath", () => {
            const wrapper = mount(
                <MockProvider
                    routes={basicRoutes()}
                    history={history}
                    location={location}
                    basePath="/base"
                >
                    <Link to="/about">
                        {({ href, active }) => (
                            <li className={active ? "active" : "not"}>
                                <a href={href}>About</a>
                            </li>
                        )}
                    </Link>
                </MockProvider>
            );
            const anchor = wrapper.find("li");
            expect(anchor.prop("className")).toEqual("active");
            expect(wrapper.find("a").prop("href")).toEqual("/base/about");
        });

        test("renders inactive link and navigates", () => {
            const wrapper = mount(
                <MockProvider
                    routes={basicRoutes()}
                    history={history}
                    location={location}
                >
                    <Link to="/">
                        {({ href, active, onClick }) => (
                            <li
                                className={active ? "active" : "not"}
                                onClick={() => onClick(event)}
                            >
                                <a href={href}>Home</a>
                            </li>
                        )}
                    </Link>
                </MockProvider>
            );
            const anchor = wrapper.find("li");
            expect(anchor.prop("className")).toEqual("not");
            expect(anchor.find("a").prop("href")).toEqual("/");
            anchor.simulate("click");
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });
});
