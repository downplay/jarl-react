import React from "react";
import { render } from "react-dom";
import createHistory from "history/createBrowserHistory";

export const bootstrapDemoApp = ({
    history = createHistory(),
    routes,
    Root
}) => {
    const container = document.getElementById("root");
    render(<Root history={history} routes={routes} />, container);
};
