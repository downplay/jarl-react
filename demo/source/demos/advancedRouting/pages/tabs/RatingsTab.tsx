import React, { Fragment, ReactNode } from "react";
import styled from "react-emotion";

const Stars = styled.span`
    font-family: system;
`;

interface RatingProps {
    stars: number;
    children?: ReactNode;
}

const Rating = ({ stars, children }: RatingProps) => (
    <p>
        <Stars>{[1, 2, 3, 4, 5].map((number) => (stars >= number ? "😀" : "🤢"))}</Stars>{" "}
        <span>{children}</span>
    </p>
);

export default () => (
    <Fragment>
        <h2 data-test="ratings-tab">Ratings</h2>
        <ul>
            <li>
                <Rating stars={5}>Best thing ever!</Rating>
            </li>
            <li>
                <Rating stars={6}>You won&rsquo;t believe it exists!</Rating>
            </li>
            <li>
                <Rating stars={1}>Not my ☕</Rating>
            </li>
            <li>
                <Rating stars={4}>I never give anything 5 stars</Rating>
            </li>
        </ul>
    </Fragment>
);
