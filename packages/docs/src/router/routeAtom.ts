/**
 * Vendored + adapted from the jarl-react-v2 draft (commit 44f8439, "v2 jotai atoms",
 * packages/jarl-react-v2/src/routeAtom.ts). Heavily borrowed from Wouter, as the
 * original comment there notes.
 *
 * Why vendored here rather than importing packages/jarl-react-v2 directly: that package
 * is the live draft other in-flight tickets (54 atoms core, 55 bindings, 56 atom gaps)
 * are actively building out into the real v2 API. Importing it as-is here would either
 * couple the docs site to a fast-moving target, or require editing it in place and
 * risking conflicts with those tickets. Copying the small, self-contained routing-atom
 * primitives into the docs site keeps this package isolated (per ticket 58's scope
 * discipline) while still dogfooding the atoms-based approach for real, and the two
 * changes made are called out below.
 *
 * Changes from the original:
 *  - `locationAtom` now comes from `./location` (a small SSR-safe implementation) rather
 *    than `jotai-location`'s `atomWithLocation()`, which reads `window.location` at
 *    module scope and can't run during SSR/SSG.
 *  - Removed dead commented-out code and a stray `console.log` left in the draft.
 * The matching/reverse-routing algorithm itself (segment-by-segment matching against a
 * parent chain, `staticRouteAtom`/`paramRouteAtom`/`transformRouteAtom`) is unchanged.
 */
import { Getter, WritableAtom, atom } from "jotai";
import { locationAtom } from "./location";

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

export type ExtractRouteParams<PathType extends string> = string extends PathType
    ? DefaultParams
    : PathType extends `${infer _Start}:${infer ParamWithOptionalRegExp}/${infer Rest}`
    ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
        ? ExtractRouteOptionalParam<Param> & ExtractRouteParams<Rest>
        : ExtractRouteOptionalParam<ParamWithOptionalRegExp> & ExtractRouteParams<Rest>
    : PathType extends `${infer _Start}:${infer ParamWithOptionalRegExp}`
    ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
        ? ExtractRouteOptionalParam<Param>
        : ExtractRouteOptionalParam<ParamWithOptionalRegExp>
    : {};

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

// jotai's WritableAtom takes a tuple of write-args (its `set(atom, ...args)` supports
// multiple arguments) rather than a single value, hence `[T]` rather than `T` here.
export type RouteAtom<T extends DefaultParams> = WritableAtom<RouteReturn<T>, [T], void>;

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
    const reverse = (get: Getter) => (values: T) => {
        const parent = get(parentAtom);
        const parentPath = parent.reverse(values as unknown as Parent);
        // TODO: Combine query parameters too
        return parentPath === "/" ? parentPath + makePath(values, get) : `${parentPath}/${makePath(values, get)}`;
    };
    return atom<RouteReturn<T & Parent>, [T], void>(
        get => {
            const parent = get(parentAtom);
            let values: T | undefined;
            if (!parent.match || !(values = matchPath(parent.rest.path[0], get))) {
                return {
                    reverse: reverse(get),
                    match: false,
                    exact: false,
                    values: undefined
                };
            }
            const rest = { path: parent.rest.path.slice(1) };
            return {
                reverse: reverse(get),
                match: true,
                exact: rest.path.length === 0,
                rest,
                values: { ...values, ...parent.values }
            };
        },
        (get, set, action) => {
            set(locationAtom, { pathname: reverse(get)(action), search: "" });
        }
    );
};

export const rootAtom = atom<RouteReturn<DefaultParams>, [DefaultParams], void>(
    get => {
        const location = get(locationAtom);
        const path = location.pathname || "/";
        const segments = path === "/" ? [""] : path.split("/");
        // Handle trailing slash
        if (segments.length > 1 && segments[segments.length - 1] === "") {
            segments.pop();
        }
        return {
            // root always matches
            match: true,
            exact: segments.length === 1,
            rest: { path: segments.slice(1) },
            reverse: () => "/",
            values: {}
        };
    },
    (_get, set) => {
        set(locationAtom, { pathname: "/", search: "" });
    }
);

export const staticRouteAtom = <Parent extends DefaultParams>(
    name: string,
    options?: RouteOptions<Parent>
): RouteAtom<Parent> => {
    return routeAtom(path => (name === path ? {} : undefined), () => name, options);
};

export const paramRouteAtom = <T extends string, Parent extends DefaultParams>(
    name: T,
    options?: RouteOptions<Parent>
) => {
    return routeAtom(
        path => (path === undefined ? undefined : ({ [name]: path } as { [key in T]: string })),
        values => values[name],
        options
    );
};

export const transformRouteAtom = <T extends DefaultParams, Return extends DefaultParams>(
    parentAtom: RouteAtom<T>,
    getter: (values: T, get: Getter) => Return | undefined,
    setter: (values: Return, get: Getter) => T
): RouteAtom<Return> => {
    const reverse = (get: Getter) => (values: Return) => {
        const transformed = setter(values, get);
        const parent = get(parentAtom);
        return parent.reverse(transformed);
    };
    return atom<RouteReturn<Return>, [Return], void>(
        get => {
            const parent = get(parentAtom);
            let transformed: Return | undefined;
            if (!parent.match || !(transformed = getter(parent.values, get))) {
                return {
                    match: false,
                    exact: false,
                    values: undefined,
                    reverse: reverse(get)
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
