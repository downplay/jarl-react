/**
 * Vendored + adapted from the jarl-react-v2 draft (commit 44f8439,
 * packages/jarl-react-v2/src/Link.tsx). See routeAtom.ts for why this is vendored
 * rather than imported from packages/jarl-react-v2. Unchanged apart from the import
 * path for `DefaultParams`/`RouteAtom`.
 */
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import type { ReactNode, AnchorHTMLAttributes, MouseEvent } from "react";
import { DefaultParams, RouteAtom } from "./routeAtom";

type Props<T extends DefaultParams> = {
    route: RouteAtom<T>;
    to?: T;
    children: ReactNode | ((props: { href: string; active: boolean; onClick: () => void }) => ReactNode);
    exactActive?: boolean;
    element?: React.ElementType;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

export const Link = <T extends DefaultParams>({
    route: routeAtom,
    to = {} as T,
    children,
    exactActive,
    element = "a",
    onClick,
    ...rest
}: Props<T>) => {
    const [route, setRoute] = useAtom(routeAtom);
    const { match, exact, reverse } = route;
    const active = useMemo(() => (exactActive ? exact : match), [match, exactActive, exact]);
    const href = useMemo(() => reverse(to as T), [reverse, to]);
    const handleClick = useCallback(
        (event?: MouseEvent<HTMLAnchorElement>) => {
            // Allow modified clicks (open in new tab, etc.) to behave natively.
            if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
                return;
            }
            if (event) event.preventDefault();
            setRoute(to as T);
        },
        [setRoute, to]
    );
    if (typeof children === "function") {
        return <>{children({ active, href, onClick: () => handleClick() })}</>;
    }
    const Element = element as React.ElementType;
    return (
        <Element
            {...rest}
            href={href}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                onClick?.(event);
                handleClick(event);
            }}
            data-active={active || undefined}
        >
            {children}
        </Element>
    );
};

export default Link;
