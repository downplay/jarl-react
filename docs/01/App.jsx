import React from "react";
import createHistory from "history/createBrowserHistory";

import { NavigationProvider, Link } from "jarl-react";

import routes from "./routes";

const Router = ({ page }) => {
    switch (page) {
        case "home":
            return <Home />;
        case "about":
            return <About />;
    }
};

const App = () => {
    <NavigationProvider history={history} routes={routes}>
        <nav>
            <Link to={{ page: "home" }} /> |
            <Link to={{ page: "about" }} />
        </nav>
        <Router />
    </NavigationProvider>;
};
