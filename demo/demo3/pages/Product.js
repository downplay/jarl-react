import React, { Fragment } from "react";
import { withState, Link } from "jarl-react";

import DetailsTab from "./tabs/DetailsTab";
import RatingsTab from "./tabs/RatingsTab";
import GalleryTab, { toImage } from "./tabs/GalleryTab";

/**
 * Function to generate a link to a specific tab
 *
 * In a real app this might be a memoized selector
 */
const toTab = tab => ({
    page: "product",
    tab
});

const renderTab = tab => {
    switch (tab) {
        case "details":
            return <DetailsTab />;
        case "ratings":
            return <RatingsTab />;
        case "gallery":
            return <GalleryTab />;
        default:
            return null;
    }
};

const Product = ({ tab }) => (
    <Fragment>
        <header>
            <h1>This Product Will Change Everything</h1>
            <p>Buy Now for only 1 BTC!</p>
            <p>Click a tab for more information:</p>
            <ul>
                <li>
                    <Link to={toTab("details")}>Details</Link>
                </li>
                <li>
                    <Link to={toTab("ratings")}>Ratings</Link>
                </li>
                <li>
                    <Link to={toImage(1)}>Gallery</Link>
                </li>
            </ul>
            {renderTab(tab)}
        </header>
    </Fragment>
);

export default withState()(Product);
