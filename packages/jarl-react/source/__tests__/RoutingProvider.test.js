/* global describe test expect beforeEach afterEach jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import mockHistory from "./mocks/mockHistory";
import wait from "./mocks/wait";

import RoutingProvider from "../RoutingProvider";
import RouteMapper from "../RouteMapper";
import redirect from "../redirect";

configure({ adapter: new Adapter() });

describe("<RoutingProvider/>", () => {
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
            },
            {
                path: "/redirected?because=:reason",
                state: { page: "redirected" }
            },
            {
                path: "/test-redirect-state",
                state: redirect({ page: "redirected", reason: "state" })
            },
            {
                path: "/test-redirect-match",
                state: {},
                match: () => redirect({ page: "redirected", reason: "match" })
            },
            {
                path: "/test-match-state-context/:someState",
                state: {},
                match: ({ someState }, { callback }) => {
                    callback(someState);
                    return { someState };
                }
            },
            {
                path: "/test-redirect-resolve?error=(:error)",
                state: {},
                resolve: async ({ error }) => {
                    if (error) {
                        throw new Error("Something bad happened");
                    }
                    return redirect({ page: "redirected", reason: "resolve" });
                }
            }
        ];
        history = mockHistory();
    });

    describe("constructor", () => {
        test("errors with no routes", () => {
            expect(() => {
                shallow(<RoutingProvider />);
            }).toThrow(/Invalid routes property/);
        });

        test("errors with no history", () => {
            expect(() => {
                shallow(<RoutingProvider routes={[]} />);
            }).toThrow(/Provider must receive a history object/);
        });

        test("converts array to RouteMapper", () => {
            const provider = shallow(
                <RoutingProvider routes={routes} history={history} />
            );
            expect(provider.state("routes")).toEqual(expect.any(RouteMapper));
        });
    });

    describe("initial navigation", () => {
        let doNavigation;

        beforeEach(() => {
            doNavigation = jest.spyOn(
                RoutingProvider.prototype,
                "doNavigation"
            );
        });

        afterEach(() => {
            doNavigation.mockClear();
        });

        test("performed normally", () => {
            shallow(<RoutingProvider routes={routes} history={history} />);
            expect(doNavigation).toHaveBeenCalledWith("/", "INITIAL");
        });

        test("is disabled with `performInitialNavigation`", () => {
            shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    performInitialNavigation={false}
                />
            );
            expect(doNavigation).not.toHaveBeenCalled();
        });

        test("history triggers doNavigation", () => {
            let listenCallback;
            history = {
                ...history,
                listen: callback => {
                    listenCallback = callback;
                }
            };
            shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    performInitialNavigation={false}
                />
            );
            listenCallback({ pathname: "/", search: "?foo=bar" }, "PUSH");
            expect(doNavigation).toHaveBeenCalledWith("/?foo=bar", "PUSH");
        });

        test("basePath is honoured", () => {
            history.location.pathname = "/foo";
            shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    basePath="/foo"
                />
            );
            expect(doNavigation).toHaveBeenCalledWith("/", "INITIAL");
        });

        test("route is ignored when basePath doesn't match", () => {
            history.location.pathname = "/bar";
            shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    basePath="/foo"
                />
            );
            expect(doNavigation).not.toHaveBeenCalled();
        });

        test("pathname and search are joined", () => {
            history.location.search = "?foo=bar";
            shallow(<RoutingProvider routes={routes} history={history} />);
            expect(doNavigation).toHaveBeenCalledWith("/?foo=bar", "INITIAL");
        });
    });

    describe("doNavigation", () => {
        let onNavigateStart;
        let onNavigateEnd;
        let onNavigateError;
        let provider;
        let contextCallback;

        beforeEach(() => {
            onNavigateStart = jest.fn();
            onNavigateEnd = jest.fn();
            onNavigateError = jest.fn();
            contextCallback = jest.fn();
            provider = shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    onNavigateStart={onNavigateStart}
                    onNavigateEnd={onNavigateEnd}
                    onNavigateError={onNavigateError}
                    performInitialNavigation={false}
                    context={() => ({ callback: contextCallback })}
                />
            ).instance();
            expect(onNavigateStart).not.toHaveBeenCalled();
        });

        test("resolve functions are executed", async () => {
            provider.doNavigation("/test-resolve", "PUSH");
            expect(onNavigateStart).toHaveBeenCalledWith({
                action: "PUSH",
                branch: [
                    {
                        path: "/test-resolve",
                        resolve: expect.any(Function),
                        routes: [
                            {
                                path: "/nested",
                                resolve: expect.any(Function),
                                state: { nested: true, page: "test-resolve" }
                            }
                        ],
                        state: { page: "test-resolve" }
                    }
                ],
                path: "/test-resolve",
                state: { page: "test-resolve" }
            });
            expect(onNavigateEnd).not.toHaveBeenCalled();
            // TODO: Maybe modify tests to use sinon
            await wait(11);
            expect(onNavigateEnd).toHaveBeenCalledWith({
                action: "PUSH",
                branch: [
                    {
                        path: "/test-resolve",
                        resolve: expect.any(Function),
                        routes: [
                            {
                                path: "/nested",
                                resolve: expect.any(Function),
                                state: { nested: true, page: "test-resolve" }
                            }
                        ],
                        state: { page: "test-resolve" }
                    }
                ],
                state: { page: "test-resolve" },
                path: "/test-resolve"
            });
            expect(one).toEqual(true);
        });

        test("nested resolve functions are executed", async () => {
            provider.doNavigation("/test-resolve/nested");
            expect(onNavigateStart).toHaveBeenCalled();
            expect(onNavigateEnd).not.toHaveBeenCalled();
            await wait(11);
            expect(onNavigateEnd).toHaveBeenCalled();
            expect(one).toEqual(true);
            expect(two).toEqual(true);
        });

        test("redirect from state is followed", () => {
            provider.doNavigation("/test-redirect-state");
            expect(history.replace).toHaveBeenCalledWith(
                "/redirected?because=state"
            );
        });

        test("redirect from matcher is followed", () => {
            provider.doNavigation("/test-redirect-match");
            expect(history.replace).toHaveBeenCalledWith(
                "/redirected?because=match"
            );
        });

        test("state and context are passed into matcher", () => {
            provider.doNavigation("/test-match-state-context/testfoo");
            expect(contextCallback).toHaveBeenCalledWith("testfoo");
        });

        test("redirect from resolver is followed", async () => {
            provider.doNavigation("/test-redirect-resolve");
            expect(onNavigateStart).toHaveBeenCalled();
            await wait(0);
            expect(history.replace).toHaveBeenCalledWith(
                "/redirected?because=resolve"
            );
        });

        test("error in resolve is passed to handler", async () => {
            provider.doNavigation(
                "/test-redirect-resolve?error=true",
                "INITIAL"
            );
            expect(onNavigateStart).toHaveBeenCalled();
            await wait(0);
            expect(onNavigateError).toHaveBeenCalledWith({
                branch: [
                    {
                        path: "/test-redirect-resolve?error=(:error)",
                        resolve: expect.any(Function),
                        state: {}
                    }
                ],
                error: new Error("Something bad happened"),
                path: "/test-redirect-resolve?error=true",
                state: { error: "true" },
                action: "INITIAL"
            });
        });

        // TODO: Very important!
        test.skip("prevents circular redirects", () => {});
    });
});
