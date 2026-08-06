import React, { ReactNode } from "react";

import RouteMap from "../../RouteMap";
import { RoutingProvider } from "../..";
import mockHistory from "./mockHistory";
import { RouteDefinition } from "../../types";

const indexRoute: RouteDefinition[] = [
    {
        path: "/",
        state: { home: true }
    }
];

export interface MockProviderProps {
    routes?: RouteDefinition[] | RouteMap;
    children?: ReactNode;
    [key: string]: any;
}

export default ({ routes = indexRoute, children, ...props }: MockProviderProps) => (
    <RoutingProvider
        routes={routes}
        history={mockHistory() as any}
        {...props}
    >
        {children}
    </RoutingProvider>
);
