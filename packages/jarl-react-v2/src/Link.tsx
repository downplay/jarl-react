import { useAtom } from "jotai";
import { DefaultParams, RouteAtom } from "./routeAtom";
import { useCallback, useMemo } from "react";

type Props<T extends DefaultParams> = {
  route: RouteAtom<T>;
  to?: T;
  children:
    | React.ReactNode
    | ((
        props: {
          href: string;
          active: boolean;
          onClick: () => void;
        }
        // props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        //   active: boolean;
        // }
      ) => React.ReactNode);
  exactActive?: boolean;
  element?: React.ElementType;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

export const Link = <T extends DefaultParams>({
  route: routeAtom,
  to = {} as T,
  children,
  exactActive,
  element = "a",
  ...rest
}: Props<T>) => {
  const [route, setRoute] = useAtom(routeAtom);
  const { match, exact, reverse } = route;
  const active = useMemo(
    () => (exactActive ? exact : match),
    [match, exactActive, exact]
  );
  const href = useMemo(() => reverse(to as T), [reverse, to]);
  const handleClick = useCallback(() => {
    setRoute(to as T);
  }, [setRoute, to]);
  if (typeof children === "function") {
    return <>{children({ active, href, onClick: handleClick })}</>;
  } else {
    const Element = element;
    return (
      <Element {...rest} href={href} onClick={handleClick}>
        <>{children}</>
      </Element>
    );
  }
};
