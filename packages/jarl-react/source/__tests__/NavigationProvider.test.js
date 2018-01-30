/* global describe test expect beforeEach afterEach jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationProvider from "../NavigationProvider";
import RouteMapper from "../RouteMapper";
import mockHistory from "./mocks/mockHistory";

configure({ adapter: new Adapter() });

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("<NavigationProvider/>", () => {
    let history;
    let routes;
    let one;
    let two;

    beforeEach(() => {
        routes = [
            {
                path: "/",
                state: { page: "index" }
            },
            {
                path: "/?foo=bar",
                state: { page: "foo" }
            },
            {
                path: "/test-resolve",
                state: { page: "test-resolve" },
                resolve: () =>
                    wait(10).then(() => {
                        one = true;
                    }),
                routes: [
                    {
                        path: "/nested",
                        state: { page: "test-resolve", nested: true },
                        resolve: () =>
                            wait(10).then(() => {
                                two = true;
                            })
                    }
                ]
            }
        ];
        history = mockHistory();
    });

    describe("constructor", () => {
        test("errors with no routes", () => {
            expect(() => {
                shallow(<NavigationProvider />);
            }).toThrow(/Invalid routes property/);
        });

        test("errors with no history", () => {
            expect(() => {
                shallow(<NavigationProvider routes={[]} />);
            }).toThrow(/Provider must receive a history object/);
        });

        test("converts array to RouteMapper", () => {
            const provider = shallow(
                <NavigationProvider routes={routes} history={history} />
            );
            expect(provider.state("routes")).toEqual(expect.any(RouteMapper));
        });
    });

    describe("initial navigation", () => {
        let doNavigation;

        beforeEach(() => {
            doNavigation = jest.spyOn(
                NavigationProvider.prototype,
                "doNavigation"
            );
        });

        afterEach(() => {
            doNavigation.mockClear();
        });

        test("performed normally", () => {
            shallow(<NavigationProvider routes={routes} history={history} />);
            expect(doNavigation).toHaveBeenCalledWith("/");
        });

        test("is disabled with `performInitialNavigation`", () => {
            shallow(
                <NavigationProvider
                    routes={routes}
                    history={history}
                    performInitialNavigation={false}
                />
            );
            expect(doNavigation).not.toHaveBeenCalled();
        });

        test("basePath is honoured", () => {
            history.location.pathname = "/foo";
            shallow(
                <NavigationProvider
                    routes={routes}
                    history={history}
                    basePath="/foo"
                />
            );
            expect(doNavigation).toHaveBeenCalledWith("/");
        });

        test("pathname and search are joined", () => {
            history.location.search = "?foo=bar";
            shallow(<NavigationProvider routes={routes} history={history} />);
            expect(doNavigation).toHaveBeenCalledWith("/?foo=bar");
        });
    });

    describe("doNavigation", () => {
        test("resolve functions are executed", async () => {
            const onNavigateStart = jest.fn();
            const onNavigateEnd = jest.fn();

            const provider = shallow(
                <NavigationProvider
                    routes={routes}
                    history={history}
                    onNavigateStart={onNavigateStart}
                    onNavigateEnd={onNavigateEnd}
                />
            ).instance();
            provider.doNavigation("/test-resolve");
            expect(onNavigateStart).toHaveBeenCalled();
            expect(onNavigateEnd).not.toHaveBeenCalled();
            await wait(10);
            expect(onNavigateEnd).toHaveBeenCalled();
            expect(one).toEqual(true);
        });

        test("nested resolve functions are executed", async () => {
            const onNavigateStart = jest.fn();
            const onNavigateEnd = jest.fn();

            const provider = shallow(
                <NavigationProvider
                    routes={routes}
                    history={history}
                    onNavigateStart={onNavigateStart}
                    onNavigateEnd={onNavigateEnd}
                />
            ).instance();
            provider.doNavigation("/test-resolve/nested");
            expect(onNavigateStart).toHaveBeenCalled();
            expect(onNavigateEnd).not.toHaveBeenCalled();
            await wait(10);
            expect(onNavigateEnd).toHaveBeenCalled();
            expect(one).toEqual(true);
            expect(two).toEqual(true);
        });
    });
});
