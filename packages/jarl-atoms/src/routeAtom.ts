// Heavily borrowed from Wouter

// Import from "jotai/vanilla" rather than the "jotai" root entry point: the
// root entry re-exports "jotai/react" too, which pulls in a React peer
// dependency this package intentionally doesn't have (React bindings are a
// separate concern — see ticket 55). "jotai/vanilla" has everything atoms
// need: atom(), Getter, WritableAtom.
import { Getter, WritableAtom, atom } from "jotai/vanilla";
import { atomWithLocation } from "jotai-location";

export type Path = string;

export type DefaultParams = {};

export type ExtractRouteOptionalParam<PathType extends Path> =
  PathType extends `${infer Param}?`
    ? { readonly [k in Param]: string | undefined }
    : PathType extends `${infer Param}*`
    ? { readonly [k in Param]: string | undefined }
    : PathType extends `${infer Param}+`
    ? { readonly [k in Param]: string }
    : { readonly [k in PathType]: string };

export type ExtractRouteParams<PathType extends string> =
  string extends PathType
    ? DefaultParams
    : PathType extends `${infer _Start}:${infer ParamWithOptionalRegExp}/${infer Rest}`
    ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
      ? ExtractRouteOptionalParam<Param> & ExtractRouteParams<Rest>
      : ExtractRouteOptionalParam<ParamWithOptionalRegExp> &
          ExtractRouteParams<Rest>
    : PathType extends `${infer _Start}:${infer ParamWithOptionalRegExp}`
    ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
      ? ExtractRouteOptionalParam<Param>
      : ExtractRouteOptionalParam<ParamWithOptionalRegExp>
    : {};

const locationAtom = atomWithLocation();

export type RouteReturn<T extends DefaultParams = DefaultParams> = {
  reverse: (values: T) => string;
} & (
  | {
      match: true;
      values: T;
      exact: boolean;
      rest: { path: string[] };
    }
  | {
      match: false;
      exact: false;
      values: undefined;
    }
);

// jotai's WritableAtom takes its write-side arguments as a tuple (Args) plus
// a Result type, rather than the single-Update-type shape older jotai
// versions used — hence `[T]` (a single-argument tuple) and `void` here.
export type RouteAtom<T extends DefaultParams> = WritableAtom<
  RouteReturn<T>,
  [T],
  void
>;

// Earlier design sketches (a tuple-shaped RouteReturn, a pattern-string-driven
// routeAtom overload, and the type plumbing they'd need) were explored here
// and are preserved with context in ../DESIGN-NOTES.md rather than dropped.

type RouteOptions<Parent extends DefaultParams> = {
  parent?: RouteAtom<Parent>;
};

export const routeAtom = <
  T extends DefaultParams = DefaultParams,
  Parent extends DefaultParams = DefaultParams
>(
  matchPath: (path: string, get: Getter) => T | undefined,
  makePath: (values: T, get: Getter) => string,
  options?: RouteOptions<Parent>
): RouteAtom<T & Parent> => {
  const parentAtom = options?.parent || (rootAtom as RouteAtom<Parent>);
  // TODO: To avoid unnecessary recomputes we should be caching a memoization of the unmatched
  // state, this way we won't recalculate all leaves of an unmatched branch
  const reverse = (get: Getter) => (values: T) => {
    const parent = get(parentAtom);
    const parentPath = parent.reverse(values as unknown as Parent);
    // TODO: Combine query parameters too
    return parentPath === "/"
      ? parentPath + makePath(values, get)
      : parentPath + "/" + makePath(values, get);
  };
  return atom(
    (get) => {
      const parent = get(parentAtom);
      let values: T | undefined;
      if (!parent.match || !(values = matchPath(parent.rest.path[0], get))) {
        return {
          reverse: reverse(get),
          match: false,
          exact: false,
          values: undefined,
        };
      }
      const rest = { path: parent.rest.path.slice(1) };
      return {
        reverse: reverse(get),
        match: true,
        exact: rest.path.length === 0,
        rest,
        values: { ...values, ...parent.values },
      };
    },
    (get, set, action) => {
      set(locationAtom, { pathname: reverse(get)(action) });
    }
  );
};

export const rootAtom = atom<RouteReturn<DefaultParams>, [DefaultParams], void>(
  (get) => {
    const location = get(locationAtom);
    const path = location.pathname || "/";
    const segments = path === "/" ? [""] : path.split("/");
    // Handle trailing slash
    // TODO: Should redirect really but not sure where to do effects yet
    if (segments.length > 1 && segments[segments.length - 1] === "") {
      segments.pop();
    }
    return {
      // root always matches
      match: true,
      exact: segments.length === 1,
      rest: { path: segments.slice(1) },
      reverse: () => "/",
      values: {},
    };
  },
  (get, set, action) => {
    set(locationAtom, { pathname: "/" });
  }
);

export const staticRouteAtom = <Parent extends DefaultParams>(
  name: string,
  options?: RouteOptions<Parent>
): RouteAtom<Parent> => {
  return routeAtom(
    (path) => (name === path ? {} : undefined),
    () => name,
    options
  );
};

export const paramRouteAtom = <T extends string, Parent extends DefaultParams>(
  name: T,
  options?: RouteOptions<Parent>
) => {
  return routeAtom(
    (path) => ({ [name]: path } as { [key in T]: string }),
    (values) => values[name],
    options
  );
};

export const transformRouteAtom = <
  T extends DefaultParams,
  Return extends DefaultParams
>(
  parentAtom: RouteAtom<T>,
  getter: (values: T, get: Getter) => Return | undefined,
  setter: (values: Return, get: Getter) => T
): RouteAtom<Return> => {
  const reverse = (get: Getter) => (values: Return) => {
    const transformed = setter(values, get);
    const parent = get(parentAtom);
    return parent.reverse(transformed);
  };
  return atom(
    (get) => {
      const parent = get(parentAtom);
      let transformed: Return | undefined;
      if (!parent.match || !(transformed = getter(parent.values, get))) {
        return {
          match: false,
          exact: false,
          values: undefined,
          reverse: reverse(get),
        };
      }
      return { ...parent, values: transformed, reverse: reverse(get) };
    },
    (get, set, action) => {
      const transformed = setter(action, get);
      set(parentAtom, transformed);
    }
  );
};
