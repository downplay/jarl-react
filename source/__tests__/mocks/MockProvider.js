import React from "react";

import { RouteMapper, NavigationProvider } from "../..";

export default ({ children, ...props }) => (
    <NavigationProvider routes={new RouteMapper()} history={{}} {...props}>
        {...children}
    </NavigationProvider>
);
