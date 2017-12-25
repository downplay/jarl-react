import React from "react";
import { withState, Link } from "jarl-react";

import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import NotFound from "./pages/NotFound";

const renderPage = page => {
    switch (page) {
        case "home":
            return <HomePage />;
        case "about":
            return <AboutPage />;
        default:
            // Handle missing pages
            return <NotFound />;
    }
};

/**
 * JARL injects the `page` prop from state via withState HOC
 */
const Pages = ({ page, ...props }) => (
    <article>
        <nav>
            <ul>
                <li>
                    <Link to={{ page: "home" }}>Home</Link>
                </li>
                <li>
                    <Link to={{ page: "about" }}>About</Link>
                </li>
            </ul>
        </nav>
        {renderPage(page)}
    </article>
);

export default withState()(Pages);
