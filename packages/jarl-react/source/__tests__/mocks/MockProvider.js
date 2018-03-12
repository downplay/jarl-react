import React from "react";

import { RoutingProvider } from "../..";
import mockHistory from "./mockHistory";

const indexRoute = [
    {
        path: "/",
        state: { home: true }
    }
];

export default ({ routes = indexRoute, children, ...props }) => (
    <RoutingProvider routes={routes} history={mockHistory()} {...props}>
        {...children}
    </RoutingProvider>
);
