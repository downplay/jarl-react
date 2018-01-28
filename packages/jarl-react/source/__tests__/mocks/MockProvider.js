import React from "react";

import { RouteMapper, NavigationProvider } from "../..";
import mockHistory from "./mockHistory";

export default ({ children, ...props }) => (
    <NavigationProvider
        routes={new RouteMapper()}
        history={mockHistory()}
        {...props}
    >
        {...children}
    </NavigationProvider>
);
