/* global describe test expect */
import safeJsonStringify from "../lib/safeJsonStringify";

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
