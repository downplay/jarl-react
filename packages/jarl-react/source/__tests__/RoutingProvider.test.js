/* global describe test expect beforeEach afterEach jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import mockHistory from "./mocks/mockHistory";
import wait from "./mocks/wait";

import RoutingProvider from "../RoutingProvider";
import RouteMap from "../RouteMap";
import redirect from "../redirect";

configure({ adapter: new Adapter() });

describe("<RoutingProvider/>", () => {
    let history;
    let routes;
    let one;
    let two;
    let marker;

    beforeEach(() => {
        marker = Symbol("marker");
        one = false;
        two = false;
        routes = new RouteMap([
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
                        return { marker };
                    }),
                routes: [
                    {
                        path: "/nested",
                        state: { page: "test-resolve", nested: true },
                        resolve: () =>
                            wait(8).then(() => {
                                two = true;
                                return { two };
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
                path: "/test-match-location-context/:someState",
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
        ]);
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

        test("converts array to RouteMap", () => {
            const provider = shallow(
                <RoutingProvider routes={routes} history={history} />
            );
            expect(provider.state("routes")).toEqual(expect.any(RouteMap));
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

        test("is disabled with `performInitialRouting`", () => {
            shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    performInitialRouting={false}
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
                    performInitialRouting={false}
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
            routes.match = jest.fn();
            shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    basePath="/foo"
                />
            );
            expect(routes.match).not.toHaveBeenCalled();
        });

        test("pathname and search are joined", () => {
            history.location.search = "?foo=bar";
            shallow(<RoutingProvider routes={routes} history={history} />);
            expect(doNavigation).toHaveBeenCalledWith("/?foo=bar", "INITIAL");
        });
    });

    describe("doNavigation", () => {
        let onChange;
        let onError;
        let provider;
        let contextCallback;

        beforeEach(() => {
            onChange = jest.fn();
            onError = jest.fn();
            contextCallback = jest.fn();
            provider = shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    onChange={onChange}
                    onError={onError}
                    performInitialRouting={false}
                    context={() => ({ callback: contextCallback })}
                />
            ).instance();
            expect(onChange).not.toHaveBeenCalled();
        });

        test("resolve functions are executed", async () => {
            provider.doNavigation("/test-resolve", "PUSH");
            // TODO: Maybe modify tests to use lolex
            await wait(11);
            expect(onChange).toHaveBeenCalledWith({
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
                location: { page: "test-resolve" },
                path: "/test-resolve",
                resolved: { marker }
            });
            expect(one).toEqual(true);
        });

        test("nested resolve functions are executed", async () => {
            expect(one).toEqual(false);
            expect(two).toEqual(false);
            provider.doNavigation("/test-resolve/nested");
            // TODO: Use lolex fake times; right now this random needs 7ms added
            // Seems unreliable
            await wait(25);

            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    resolved: {
                        marker,
                        two
                    }
                })
            );
            expect(one).toEqual(true);
            expect(two).toEqual(true);
        });

        test("nested resolve functions are executed in series", async () => {
            provider.doNavigation("/test-resolve/nested");
            // Very random time, working reliably right now but will probably fail in CI.
            // At least proves that one executes before two. Sinon will fix this.
            await wait(13);
            expect(one).toEqual(true);
            expect(two).toEqual(false);
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

        test("location and context are passed into matcher", () => {
            provider.doNavigation("/test-match-location-context/testfoo");
            expect(contextCallback).toHaveBeenCalledWith("testfoo");
        });

        test("redirect from resolver is followed", async () => {
            provider.doNavigation("/test-redirect-resolve");
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
            await wait(0);
            expect(onError).toHaveBeenCalledWith({
                branch: [
                    {
                        path: "/test-redirect-resolve?error=(:error)",
                        resolve: expect.any(Function),
                        state: {}
                    }
                ],
                error: new Error("Something bad happened"),
                path: "/test-redirect-resolve?error=true",
                location: { error: "true" },
                action: "INITIAL"
            });
        });

        // TODO: Very important!
        test.skip("prevents circular redirects", () => {});
    });
});
