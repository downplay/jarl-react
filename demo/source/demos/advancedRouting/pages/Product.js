import React, { Fragment } from "react";
import { routing, Link } from "jarl-react";
import { Tab, Tabs } from "rebass-emotion";

import DetailsTab from "./tabs/DetailsTab";
import RatingsTab from "./tabs/RatingsTab";
import GalleryTab, { toImage } from "./tabs/GalleryTab";
import { Header } from "../../../layout/index";

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
        <Tabs>
            <Tab>
                <Link data-test="details-tab-link" to={toTab("details")}>
                    Details
                </Link>
            </Tab>
            <Tab>
                <Link data-test="ratings-tab-link" to={toTab("ratings")}>
                    Ratings
                </Link>
            </Tab>
            <Tab>
                <Link data-test="gallery-tab-link" to={toImage(1)}>
                    Gallery
                </Link>
            </Tab>
        </Tabs>
        {renderTab(tab)}
    </Fragment>
);

export default routing()(Product);
