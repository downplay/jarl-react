import React, { Fragment } from "react";
import { routing } from "jarl-react";
import { Menu, Segment } from "semantic-ui-react";

import DetailsTab from "./DetailsTab";
import RatingsTab from "./RatingsTab";
import GalleryTab, { toImage } from "./GalleryTab";
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
        <Menu tabular attached="top">
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
        <Segment attached="bottom">{renderTab(tab)}</Segment>
    </Fragment>
);

export default routing()(Product);
