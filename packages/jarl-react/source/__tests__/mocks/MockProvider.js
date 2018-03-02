import React from "react";

import { NavigationProvider } from "../..";
import mockHistory from "./mockHistory";

const indexRoute = [
    {
        path: "/",
        state: { home: true }
    }
];

export default ({ routes = indexRoute, children, location, ...props }) => (
    <NavigationProvider routes={routes} history={mockHistory()} {...props}>
        {...children}
    </NavigationProvider>
);
