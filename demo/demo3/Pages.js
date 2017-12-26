import React from "react";
import { withState, Link } from "jarl-react";

import HomePage from "./pages/Home";
import ProductPage from "./pages/Product";
import NotFound from "./pages/NotFound";

const renderPage = (page, missingPath) => {
    switch (page) {
        case "home":
            return <HomePage />;
        case "product":
            return <ProductPage />;
        default:
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
                    <Link to={{ page: "home" }}>Home</Link>
                </li>
                <li>
                    <Link to={{ page: "product" }}>Product</Link>
                </li>
            </ul>
        </nav>
        {renderPage(page, missingPath)}
    </article>
);

export default withState()(Pages);
