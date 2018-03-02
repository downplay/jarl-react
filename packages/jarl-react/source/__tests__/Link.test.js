/* global describe test jest expect beforeEach */

import React from "react";
import { configure, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Link from "../Link";
import MockProvider from "./mocks/MockProvider";
import mockHistory from "./mocks/mockHistory";
import wait from "./mocks/wait";

import { basicRoutes } from "./dummy/routes";

configure({ adapter: new Adapter() });

describe("<Link/>", () => {
    test("renders an anchor from a URL", () => {
        const anchor = render(
            <MockProvider>
                <Link to="/">Home</Link>
            </MockProvider>
        );
        expect(anchor[0].name).toEqual("a");
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("renders a different component", () => {
        const anchor = render(
            <MockProvider>
                <Link to="/" component="div">
                    Home
                </Link>
            </MockProvider>
        );
        expect(anchor[0].name).toEqual("div");
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("renders an anchor from a state object", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()}>
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/");
        expect(anchor.text()).toEqual("Home");
    });

    test("basePath is prepended to URL", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()} basePath="/foo">
                <Link to={{ page: "home" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/foo");
    });

    test("paths are concatenated correctly", () => {
        const anchor = render(
            <MockProvider routes={basicRoutes()} basePath="/foo">
                <Link to={{ page: "about" }}>Home</Link>
            </MockProvider>
        );
        expect(anchor.prop("href")).toEqual("/foo/about");
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
        test("renders active link", async () => {
            const wrapper = mount(
                <MockProvider
                    routes={basicRoutes()}
                    history={history}
                    state={location}
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
            await wait(100);
            const anchor = wrapper.find("li");
            expect(anchor.prop("className")).toEqual("active");
            expect(wrapper.find("a").prop("href")).toEqual("/about");
        });

        test("renders inactive link and navigates", async () => {
            const wrapper = mount(
                <MockProvider
                    routes={basicRoutes()}
                    history={history}
                    state={location}
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
            await wait(100);
            const anchor = wrapper.find("li");
            expect(anchor.prop("className")).toEqual("not");
            expect(anchor.find("a").prop("href")).toEqual("/");
            anchor.simulate("click");
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });
});
