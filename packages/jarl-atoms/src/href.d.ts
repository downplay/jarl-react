export type Path = string;
export declare const normalizePathname: (pathname: string) => string;
/**
 * Splits a full href (e.g. `/foo/bar?a=1&b=2`) into a normalized pathname
 * and a URLSearchParams instance for the query string.
 */
export declare const splitHref: (href: Path) => [pathname: string, searchParams: URLSearchParams];
/**
 * Appends/overwrites a single query param onto an existing href, returning
 * the combined href. Used when composing queryParamAtom on top of a parent
 * route atom's reverse() output.
 */
export declare const appendQueryParam: (href: Path, key: string, value: string | undefined) => Path;
/**
 * Joins a pathname and a URLSearchParams back into a single href string.
 */
export declare const joinHref: (pathname: string, searchParams: URLSearchParams) => Path;
