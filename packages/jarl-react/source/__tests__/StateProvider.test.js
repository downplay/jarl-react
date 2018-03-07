/* global describe test expect jest */
import React from "react";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { RoutingProvider } from "../";

import StateProvider from "../StateProvider";
import mockHistory from "./mocks/mockHistory";

configure({ adapter: new Adapter() });

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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
            state: {}
        });
        expect(props.routes).toEqual(routes);
        expect(props.context).toEqual(expect.any(Function));
        expect(props.onNavigateEnd).toEqual(expect.any(Function));
    });

    test("passes through `onNavigateEnd`", async () => {
        const { routes, history, context, children } = create();
        const onNavigateEnd = jest.fn();
        mount(
            <StateProvider
                {...{ routes, history, context, children, onNavigateEnd }}
            />
        );
        await wait(0);
        expect(onNavigateEnd).toHaveBeenCalledWith({
            action: "INITIAL",
            branch: [{ path: "/", state: { home: true } }],
            state: { home: true },
            path: "/"
        });
    });
});