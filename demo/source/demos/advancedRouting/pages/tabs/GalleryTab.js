import React, { Fragment } from "react";

/**
 * We'll use routing to inject imageId from the router location
 *
 * In a later demo we'll see how to sync the router location into a
 * global store like Redux, and use Redux connect instead
 */
import { routing, Link } from "jarl-react";

import { galleryData } from "../../../../data";

export const toImage = imageId => ({
    page: "product",
    tab: "gallery",
    imageId
});

const GalleryTab = ({ imageId }) => (
    <Fragment>
        <h2 data-test="gallery-tab">Gallery</h2>
        {galleryData[imageId] ? (
            <img
                src={galleryData[imageId].url}
                alt="Full size pic"
                data-test="image-full-size"
            />
        ) : (
            <p data-test="missing-image">Image id {imageId} not found!</p>
        )}
        {Object.entries(galleryData).map(([id, image]) => (
            <Link
                to={toImage(id)}
                data-test={`gallery-image-link-${id}`}
                key={id}
            >
                <img width="100" src={image.url} alt="Gallery pic" />
            </Link>
        ))}
    </Fragment>
);

export default routing()(GalleryTab);
