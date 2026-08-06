import React from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { Menu } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

import HomePage from "./pages/Home";
import ProductPage from "./pages/Product";
import NotFound from "../../pages/NotFound";

const renderPage = (page: string, missingPath: string) => {
    switch (page) {
        case "home":
            return <HomePage />;
        case "product":
            return <ProductPage />;
        default:
            return <NotFound missingPath={missingPath} />;
    }
};

// Props are injected by the `routing` HOC below (location state, mirroring
// jarl-react's own `Location = Record<string, any>` design).
interface PagesProps {
    page: string;
    missingPath: string;
}

/**
 * JARL injects the `page` prop from location via routing HOC
 */
const Pages = ({ page, missingPath }: PagesProps) => (
    <Layout>
        <Helmet titleTemplate="%s | Advanced Routing | JARL Demos" />
        <Menu>
            <MenuItem to={{ page: "home" }} data-test="home-link">
                Home
            </MenuItem>
            <MenuItem to={{ page: "product" }} data-test="product-link">
                Product
            </MenuItem>
        </Menu>
        {renderPage(page, missingPath)}
    </Layout>
);

// `Pages` is cast to `any` here because `routing`'s generic HOC typing (based on
// React's legacy context API) can't statically express "these props are injected
// by the HOC rather than passed in by callers" - a documented dynamic boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default routing()(Pages as any);
