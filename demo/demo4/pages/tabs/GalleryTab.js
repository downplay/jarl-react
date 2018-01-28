import React, { Fragment } from "react";

/**
 * We'll use withLocation to inject imageId from the router's state
 *
 * In a later demo we'll see how to sync the router state into a
 * global store like Redux, and use Redux connect instead
 */
import { withLocation, Link } from "jarl-react";

import { galleryData } from "../../../data";

export const toImage = imageId => ({
    page: "product",
    tab: "gallery",
    imageId
});

const GalleryTab = ({ imageId }) => (
    <Fragment>
        <h2>Gallery</h2>
        {galleryData[imageId] ? (
            <img src={galleryData[imageId].url} alt="Full size pic" />
        ) : (
            <p>Image id {imageId} not found!</p>
        )}
        {Object.entries(galleryData).map(([id, image]) => (
            <Link to={toImage(id)}>
                <img width="100" src={image.url} alt="Gallery pic" />
            </Link>
        ))}
    </Fragment>
);

export default withLocation()(GalleryTab);
