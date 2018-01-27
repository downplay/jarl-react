/* global describe test expect beforeEach afterEach jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationProvider from "../NavigationProvider";
import RouteMapper from "../RouteMapper";

configure({ adapter: new Adapter() });

describe("<NavigationProvider/>", () => {
    let mockHistory;
    let routes;

    beforeEach(() => {
        routes = [
            {
                path: "/",
                state: { page: "index" }
            }
        ];
        mockHistory = {
            listen: jest.fn(),
            location: {
                pathname: "/"
            }
        };
    });

    test("converts array to RouteMapper", () => {
        const provider = shallow(
            <NavigationProvider routes={routes} history={mockHistory} />
        );
        expect(provider.state("routes")).toEqual(expect.any(RouteMapper));
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
            shallow(
                <NavigationProvider routes={routes} history={mockHistory} />
            );
            expect(doNavigation).toHaveBeenCalledWith("/");
        });

        test("is disabled with `performInitialNavigation`", () => {
            shallow(
                <NavigationProvider
                    routes={routes}
                    history={mockHistory}
                    performInitialNavigation={false}
                />
            );
            expect(doNavigation).not.toHaveBeenCalled();
        });
    });
});
