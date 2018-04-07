/* global describe test expect jest */
import React from "react";
import { shallow, mount } from "enzyme";

import { RoutingProvider } from "../";

import StateProvider from "../StateProvider";
import mockHistory from "./mocks/mockHistory";

const create = (pathname, search) => ({
    history: mockHistory(pathname, search),
    children: <div />,
    context: jest.fn(),
    routes: [
        {
            path: "/",
            state: { home: true }
        }
    ]
});

describe("<StateProvider/>", () => {
    test("renders a RoutingProvider", () => {
        const { routes, history, context, children } = create();
        const provider = shallow(
            <StateProvider {...{ routes, history, context, children }} />
        );
        const childProvider = provider.find(RoutingProvider);

        expect(childProvider.length).toEqual(1);
        const props = childProvider.props();
        expect(props).toMatchObject({
            routes,
            history,
            children,
            location: {}
        });
        expect(props.routes).toEqual(routes);
        expect(props.context).toEqual(expect.any(Function));
        expect(props.onChange).toEqual(expect.any(Function));
    });

    test("passes through `onChange`", () => {
        const { routes, history, context, children } = create();
        const onChange = jest.fn();
        mount(
            <StateProvider
                {...{ routes, history, context, children, onChange }}
            />
        );
        expect(onChange).toHaveBeenCalledWith({
            action: "INITIAL",
            branch: [{ path: "/", state: { home: true } }],
            location: { home: true },
            path: "/",
            resolved: {}
        });
    });
});
