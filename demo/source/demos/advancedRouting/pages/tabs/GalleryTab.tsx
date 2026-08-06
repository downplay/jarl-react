import React, { Fragment } from "react";

/**
 * We'll use routing to inject imageId from the router location
 *
 * In a later demo we'll see how to sync the router location into a
 * global store like Redux, and use Redux connect instead
 */
import { routing, Link } from "jarl-react";

import { galleryData } from "../../../../data";

// Called with both a number (Product.tsx's initial gallery link) and a string
// (the `id` key from `Object.entries(galleryData)` below), hence the union type.
export const toImage = (imageId: string | number) => ({
    page: "product",
    tab: "gallery",
    imageId
});

interface GalleryTabProps {
    imageId?: string | number;
}

const GalleryTab = ({ imageId }: GalleryTabProps) => (
    <Fragment>
        <h2 data-test="gallery-tab">Gallery</h2>
        {imageId !== undefined && galleryData[imageId] ? (
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default routing()(GalleryTab as any);
