import React from "react";
import { connect } from "react-redux";
import { Link } from "jarl-react";

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
 * This time, our location state is injected directly from Redux connect
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

export default connect(({ navigation }) => ({ ...navigation }))(Pages);
