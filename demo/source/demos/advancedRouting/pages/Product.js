import React, { Fragment } from "react";
import { routing } from "jarl-react";
import { Menu } from "semantic-ui-react";

import DetailsTab from "./tabs/DetailsTab";
import RatingsTab from "./tabs/RatingsTab";
import GalleryTab, { toImage } from "./tabs/GalleryTab";
import { Header, MenuItem } from "../../../layout";

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
        <Header>This Product Will Change Everything</Header>
        <p>Buy Now for only 1 BTC!</p>
        <p>Click a tab for more information:</p>
        <Menu pointing>
            <MenuItem data-test="details-tab-link" to={toTab("details")}>
                Details
            </MenuItem>
            <MenuItem data-test="ratings-tab-link" to={toTab("ratings")}>
                Ratings
            </MenuItem>
            <MenuItem data-test="gallery-tab-link" to={toImage(1)}>
                Gallery
            </MenuItem>
        </Menu>
        {renderTab(tab)}
    </Fragment>
);

export default routing()(Product);
