/* global describe test expect */
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { safeJsonStringify } from "../NavigationProvider";

configure({ adapter: new Adapter() });

describe("<NavigationProvider/>", () => {});

describe("safeJsonStringify()", () => {
    test("stringify object", () => {
        expect(safeJsonStringify({ foo: "bar" })).toEqual(`{"foo":"bar"}`);
    });
    test("stringify recursive object", () => {
        const recursive = {};
        recursive.foo = recursive;
        expect(safeJsonStringify(recursive)).toEqual(`[Circular reference]`);
    });
});
