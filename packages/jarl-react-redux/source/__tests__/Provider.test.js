/* global describe test expect jest */
import React from "react";
import { shallow } from "enzyme";

import { RoutingProvider } from "jarl-react";

import Provider from "../Provider";
import mockHistory from "../../../jarl-react/source/__tests__/mocks/mockHistory";

const mockStore = () => ({
    getState: () => ({ navigation: {} }),
    dispatch: jest.fn()
});

const create = (pathname, search) => ({
    store: mockStore(),
    history: mockHistory(pathname, search),
    children: <div />,
    context: jest.fn()
});

describe("<Provider/>", () => {
    test("errors with no store", () => {
        expect(() => {
            shallow(<Provider />);
        }).toThrow(/Provider must receive a store/);

        expect(() => {
            shallow(<Provider store={{}} />);
        }).toThrow(/Provider must be given a Redux store/);
    });

    test("renders a RoutingProvider", () => {
        const { store, history, children, context } = create();
        const provider = shallow(
            <Provider
                routes={[]}
                store={store}
                history={history}
                context={context}
            >
                {children}
            </Provider>
        );
        const childProvider = provider.find(RoutingProvider);

        expect(childProvider.length).toEqual(1);
        const props = childProvider.props();
        expect(props).toMatchObject({
            history,
            children,
            state: {}
        });
        expect(props.routes).toEqual([]);
        expect(props.context).toEqual(expect.any(Function));
        expect(props.onChange).toEqual(expect.any(Function));
    });
});
