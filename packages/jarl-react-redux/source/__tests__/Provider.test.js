/* global describe test expect */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { NavigationProvider } from "jarl-react";

import Provider from "../Provider";

configure({ adapter: new Adapter() });

const mockStore = () => ({
    getState: () => ({})
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
        const provider = shallow(<Provider routes={[]} store={mockStore()} />);
        const childProvider = provider.find(NavigationProvider);

        expect(childProvider.length).toEqual(1);
        expect(childProvider.props()).toEqual({});
    });
});
