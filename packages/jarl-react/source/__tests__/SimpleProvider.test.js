/* global describe test expect jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { NavigationProvider } from "../";

import SimpleProvider from "../SimpleProvider";
import mockHistory from "./mocks/mockHistory";

configure({ adapter: new Adapter() });

const create = (pathname = "/") => ({
    history: mockHistory(pathname),
    children: <div />,
    context: jest.fn(),
    routes: []
});

describe("<SimpleProvider/>", () => {
    test("renders a NavigationProvider", () => {
        const { routes, history, context, children } = create();
        const provider = shallow(
            <SimpleProvider {...{ routes, history, context, children }} />
        );
        const childProvider = provider.find(NavigationProvider);

        expect(childProvider.length).toEqual(1);
        const props = childProvider.props();
        expect(props).toMatchObject({
            routes,
            history,
            children,
            state: {}
        });
        expect(props.routes).toEqual(routes);
        expect(props.context).toEqual(expect.any(Function));
        expect(props.onNavigateEnd).toEqual(expect.any(Function));
    });
});
