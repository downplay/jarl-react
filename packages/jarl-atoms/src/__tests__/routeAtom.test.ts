import { describe, expect, it } from "vitest";
import { createStore } from "jotai/vanilla";
import {
  DefaultParams,
  paramRouteAtom,
  RouteReturn,
  rootAtom,
  routeAtom,
  staticRouteAtom,
  transformRouteAtom,
} from "../routeAtom";

// RouteReturn is a discriminated union on `match` — asserting it here lets
// the rest of a test access `.rest`/`.values` on the matched branch without
// every call site having to re-narrow inline.
function assertMatch<T extends DefaultParams>(
  result: RouteReturn<T>
): asserts result is RouteReturn<T> & { match: true } {
  if (!result.match) {
    throw new Error("expected route to match, but it did not");
  }
}

describe("rootAtom", () => {
  it("matches the root path exactly by default", () => {
    const store = createStore();

    const result = store.get(rootAtom);

    assertMatch(result);
    expect(result.exact).toBe(true);
    expect(result.rest.path).toEqual([]);
  });

  it("normalizes a trailing slash the same as no trailing slash", () => {
    const store = createStore();
    // A route whose own segment name embeds the trailing slash, so we can
    // exercise rootAtom's normalization purely through the atoms' own
    // setters rather than reaching into window.location directly.
    const trailing = routeAtom(
      (path) => (path === "trailing" ? {} : undefined),
      () => "trailing/"
    );

    store.set(trailing, {});

    const root = store.get(rootAtom);
    assertMatch(root);
    expect(root.rest.path).toEqual(["trailing"]);

    const result = store.get(trailing);
    assertMatch(result);
    expect(result.exact).toBe(true);
  });
});

describe("staticRouteAtom", () => {
  it("matches its own segment after navigating to it", () => {
    const store = createStore();
    const about = staticRouteAtom("about");

    store.set(about, {});

    const result = store.get(about);
    assertMatch(result);
    expect(result.exact).toBe(true);
  });

  it("does not match a different static segment", () => {
    const store = createStore();
    const about = staticRouteAtom("about");
    const contact = staticRouteAtom("contact");

    store.set(about, {});

    expect(store.get(about).match).toBe(true);
    expect(store.get(contact).match).toBe(false);
  });

  it("computes hrefs via reverse() without navigating", () => {
    const store = createStore();
    const about = staticRouteAtom("about");

    expect(store.get(about).reverse({})).toBe("/about");
  });
});

describe("paramRouteAtom", () => {
  it("extracts a dynamic segment's value", () => {
    const store = createStore();
    const users = staticRouteAtom("users");
    const user = paramRouteAtom("id", { parent: users });

    store.set(user, { id: "42" });

    const result = store.get(user);
    assertMatch(result);
    expect(result.values).toEqual({ id: "42" });
    expect(result.exact).toBe(true);
  });

  it("builds nested hrefs through parent routes", () => {
    const store = createStore();
    const users = staticRouteAtom("users");
    const user = paramRouteAtom("id", { parent: users });

    expect(store.get(user).reverse({ id: "7" })).toBe("/users/7");
  });

  it("is not exact when there is leftover path beneath it, and nested children see it", () => {
    const store = createStore();
    const users = staticRouteAtom("users");
    const user = paramRouteAtom("id", { parent: users });
    const tab = staticRouteAtom("profile", { parent: user });

    store.set(tab, { id: "42" });

    const userResult = store.get(user);
    assertMatch(userResult);
    expect(userResult.values).toEqual({ id: "42" });
    expect(userResult.exact).toBe(false);

    const tabResult = store.get(tab);
    assertMatch(tabResult);
    expect(tabResult.exact).toBe(true);
  });
});

describe("nested composition", () => {
  it("does not match children when a parent segment differs", () => {
    const store = createStore();
    const users = staticRouteAtom("users");
    const user = paramRouteAtom("id", { parent: users });
    const about = staticRouteAtom("about");

    store.set(about, {});

    expect(store.get(user).match).toBe(false);
  });
});

describe("transformRouteAtom", () => {
  it("transforms values through to the underlying route atom on read and write", () => {
    const store = createStore();
    const users = staticRouteAtom("users");
    const user = paramRouteAtom("id", { parent: users });
    const numericUser = transformRouteAtom<{ id: string }, { id: number }>(
      user,
      (values) => ({ id: Number(values.id) }),
      (values) => ({ id: String(values.id) })
    );

    store.set(numericUser, { id: 99 });

    const result = store.get(numericUser);
    assertMatch(result);
    expect(result.values).toEqual({ id: 99 });

    // The underlying route atom still deals in the untransformed (string) form.
    const underlying = store.get(user);
    assertMatch(underlying);
    expect(underlying.values).toEqual({ id: "99" });
  });
});
