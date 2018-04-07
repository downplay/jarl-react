/* global describe test expect beforeEach afterEach jest */
import React from "react";
import { shallow } from "enzyme";

import mockHistory from "./mocks/mockHistory";
import wait from "./mocks/wait";

import RoutingProvider from "../RoutingProvider";
import RouteMap from "../RouteMap";
import redirect from "../redirect";

describe("<RoutingProvider/>", () => {
    let history;
    let routes;
    let one;
    let two;
    let marker;
    let resolveOneSignal;
    let resolveTwoSignal;

    beforeEach(() => {
        resolveOneSignal = null;
        resolveTwoSignal = null;
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
                    new Promise((resolve, reject) => {
                        resolveOneSignal = () => {
                            one = true;
                            resolve({ marker });
                        };
                    }),
                routes: [
                    {
                        path: "/nested",
                        state: { page: "test-resolve", nested: true },
                        resolve: () =>
                            new Promise((resolve, reject) => {
                                resolveTwoSignal = () => {
                                    two = true;
                                    resolve({ two });
                                };
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
            routes.match = jest.fn(() => ({ branch: [], location: {} }));
            shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    basePath="/foo"
                />
            );
            expect(doNavigation).toHaveBeenCalledWith("/foo", "INITIAL");
            expect(routes.match).toHaveBeenCalledWith("/", {});
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

        test("is synchronous when no resolve functions", () => {
            provider.doNavigation("/", "PUSH");
            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    path: "/",
                    location: { page: "index" }
                })
            );
        });

        test("resolve functions are executed", async () => {
            provider.doNavigation("/test-resolve", "PUSH");
            expect(onChange).not.toHaveBeenCalled();
            await wait(0);
            resolveOneSignal();
            await wait(0);
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

        test("nested resolve functions are executed in series", async () => {
            // TODO: Error or redirect in first resolve prevents 2nd resolve
            provider.doNavigation("/test-resolve/nested");
            await wait(10);
            expect(resolveOneSignal).toEqual(expect.any(Function));
            expect(resolveTwoSignal).toEqual(null);
            resolveOneSignal();
            await wait(0);
            expect(resolveTwoSignal).toEqual(expect.any(Function));
        });

        test("nested resolve functions are executed", async () => {
            expect(one).toEqual(false);
            expect(two).toEqual(false);
            provider.doNavigation("/test-resolve/nested");
            await wait(0);
            resolveOneSignal();
            await wait(0);
            resolveTwoSignal();
            await wait(0);
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

    describe("navigate and redirect", () => {
        let router;
        beforeEach(() => {
            const wrapper = shallow(
                <RoutingProvider
                    routes={routes}
                    history={history}
                    performInitialRouting={false}
                    basePath="/foo"
                />
            );
            router = wrapper.instance();
        });

        test("navigate with basePath", () => {
            router.handleNavigate({ page: "index" });
            expect(history.push).toHaveBeenCalledWith("/foo");
        });

        test("redirect with basePath", () => {
            router.handleRedirect({ page: "index" });
            expect(history.replace).toHaveBeenCalledWith("/foo");
        });
    });
});
