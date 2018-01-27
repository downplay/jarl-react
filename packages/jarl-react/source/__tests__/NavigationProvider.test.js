/* global describe test expect beforeEach jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationProvider from "../NavigationProvider";
import RouteMapper from "../RouteMapper";

configure({ adapter: new Adapter() });

describe("<NavigationProvider/>", () => {
    let mockHistory;

    beforeEach(() => {
        mockHistory = {
            listen: jest.fn(),
            location: {
                pathname: "/"
            }
        };
    });

    test("converts array to RouteMapper", () => {
        const routes = [
            {
                path: "/",
                state: { page: "index" }
            }
        ];
        const provider = shallow(
            <NavigationProvider routes={routes} history={mockHistory} />
        );
        expect(provider.state("routes")).toEqual(expect.any(RouteMapper));
    });
});
