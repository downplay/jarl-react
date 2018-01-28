/* global describe test expect jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { NavigationProvider } from "jarl-react";

import Provider from "../Provider";
import mockHistory from "../../../jarl-react/source/__tests__/mocks/mockHistory";

configure({ adapter: new Adapter() });

const mockStore = () => ({
    getState: () => ({ navigation: {} }),
    dispatch: jest.fn()
});

const create = (pathname = "/") => ({
    store: mockStore(),
    history: mockHistory(pathname),
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

    test("renders a NavigationProvider", () => {
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
        const childProvider = provider.find(NavigationProvider);

        expect(childProvider.length).toEqual(1);
        const props = childProvider.props();
        expect(props).toMatchObject({
            history,
            children,
            state: {}
        });
        expect(props.routes).toEqual([]);
        expect(props.context).toEqual(expect.any(Function));
        expect(props.onNavigateStart).toEqual(expect.any(Function));
        expect(props.onNavigateEnd).toEqual(expect.any(Function));
    });
});
