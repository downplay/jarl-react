import { useAtomValue } from "jotai";
import { RouteAtom, DefaultParams } from "./routeAtom";

type Props<T extends DefaultParams> = {
  on: RouteAtom<T>;
  children?: React.ReactNode | ((values: T) => React.ReactNode | undefined);
  exact?: boolean;
};

export const Route = <T extends DefaultParams>({
  on,
  children,
  exact,
}: Props<T>) => {
  const { match, exact: isExact, values } = useAtomValue(on);
  if (!match || (exact && !isExact)) {
    return null;
  }
  return <>{typeof children === "function" ? children(values) : children}</>;
};
