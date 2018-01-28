/* global describe test expect beforeEach afterEach jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationProvider from "../NavigationProvider";
import RouteMapper from "../RouteMapper";
import mockHistory from "./mocks/mockHistory";

configure({ adapter: new Adapter() });

describe("<NavigationProvider/>", () => {
    let history;
    let routes;

    beforeEach(() => {
        routes = [
            {
                path: "/",
                state: { page: "index" }
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
});
