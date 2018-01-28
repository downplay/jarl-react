import React, { Fragment } from "react";

const Rating = ({ stars, children }) => (
    <p>
        {stars} / 5 <span>{children}</span>
    </p>
);

export default () => (
    <Fragment>
        <h2>Ratings</h2>
        <ul>
            <li>
                <Rating stars={5}>Best thing ever!</Rating>
            </li>
            <li>
                <Rating stars={6}>You won&rsquo;t believe it exists!</Rating>
            </li>
            <li>
                <Rating stars={1}>Killed my dog</Rating>
            </li>
            <li>
                <Rating stars={4}>Am too cool to give 5 stars</Rating>
            </li>
        </ul>
    </Fragment>
);
