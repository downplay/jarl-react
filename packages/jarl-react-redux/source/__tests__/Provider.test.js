/* global describe test expect jest */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { NavigationProvider, RouteMapper } from "jarl-react";

import Provider from "../Provider";

configure({ adapter: new Adapter() });

expect.extend({
    toBeInstanceOf(received, argument) {
        const pass = received instanceof argument;
        if (pass) {
            return {
                message: () =>
                    `expected ${received} not to be instance of ${argument}`,
                pass: true
            };
        }
        return {
            message: () => `expected ${received} to be insance of ${argument}`,
            pass: false
        };
    }
});

const mockStore = () => ({
    getState: () => ({ navigation: {} }),
    dispatch: jest.fn()
});

const mockHistory = pathname => ({ location: pathname });

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

    test("errors with no routes", () => {
        expect(() => {
            shallow(<Provider store={mockStore()} />);
        }).toThrow(/Invalid routes property/);
    });

    test("errors with no history", () => {
        expect(() => {
            shallow(<Provider store={mockStore()} routes={[]} />);
        }).toThrow(/Provider must receive a history object/);
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
            context,
            history,
            children,
            state: {},
            routes: expect.any(RouteMapper),
            onNavigateStart: expect.any(Function),
            onNavigateEnd: expect.any(Function)
        });
    });
});
