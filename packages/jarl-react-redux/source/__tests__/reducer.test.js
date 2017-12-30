/* global describe test expect */

import reducer from "../reducer";
import { navigateEnd } from "../actions";

describe("reducer", () => {
    test("initial state", () => {
        expect(reducer()).toEqual({
            isEntering: false,
            isNavigating: false,
            isTransitioning: false,
            location: null,
            destination: null,
            path: ""
        });
    });

    test("NAVIGATE_END", () => {
        expect(reducer(undefined, navigateEnd({ foo: "bar" }, "/"))).toEqual({
            isEntering: false,
            isNavigating: false,
            isTransitioning: false,
            location: { foo: "bar" },
            destination: null,
            path: "/"
        });
    });
});
