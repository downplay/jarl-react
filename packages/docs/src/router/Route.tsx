/**
 * Vendored + adapted from the jarl-react-v2 draft (commit 44f8439,
 * packages/jarl-react-v2/src/Route.tsx). See routeAtom.ts for why this is vendored
 * rather than imported from packages/jarl-react-v2. Unchanged apart from the import
 * path for `DefaultParams`/`RouteAtom`.
 */
import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { RouteAtom, DefaultParams } from "./routeAtom";

type Props<T extends DefaultParams> = {
    on: RouteAtom<T>;
    children?: ReactNode | ((values: T) => ReactNode | undefined);
    exact?: boolean;
};

export const Route = <T extends DefaultParams>({ on, children, exact }: Props<T>) => {
    const { match, exact: isExact, values } = useAtomValue(on);
    if (!match || (exact && !isExact)) {
        return null;
    }
    return <>{typeof children === "function" ? children(values) : children}</>;
};

export default Route;
