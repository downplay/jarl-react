import React from "react";
import { withState, Link } from "jarl-react";

import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import NotFound from "./pages/NotFound";

const renderPage = (page, missingPath) => {
    switch (page) {
        case "home":
            return <HomePage />;
        case "about":
            return <AboutPage />;
        default:
            // Handle missing pages
            return <NotFound missingPath={missingPath} />;
    }
};

/**
 * JARL injects the `page` prop from state via withState HOC
 */
const Pages = ({ page, missingPath }) => (
    <article>
        <nav>
            <ul>
                <li>
                    <Link to={{ page: "home" }} data-test="home-link">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to={{ page: "about" }} data-test="about-link">
                        About
                    </Link>
                </li>
            </ul>
        </nav>
        {renderPage(page, missingPath)}
    </article>
);

export default withState()(Pages);
